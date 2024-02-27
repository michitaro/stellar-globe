import re
import contextlib
import json
import logging
import shutil
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from .extractschema import extractSchema
from .pycodemanipulate import replace_definition, replace_type_annotation


def main():
    logging.basicConfig(level=logging.INFO)

    tmp_dir = Path('./tmp/models')
    dest_dir = Path('./hscmap/models')
    app_schema = load_json_file(Path('../app/devel/jsonschema/root.json'))
    jupyter_schema = load_json_file(Path('./devel/jsonschema/root.json'))

    shutil.rmtree(tmp_dir, ignore_errors=True)

    with make_models_parallel() as make_model:
        for model_name in extractSchema(jupyter_schema, ['PythonToFrontend'])['properties'].keys():
            schema = extractSchema(jupyter_schema, ['PythonToFrontend', model_name])
            make_model(
                schema,
                tmp_dir / f'{model_name}.py',
                {'Model.type': f"type: Literal[{repr(model_name)}]"},
            )

        for model_name in extractSchema(jupyter_schema, ['FrontendToPython'])['properties'].keys():
            schema = extractSchema(jupyter_schema, ['FrontendToPython', model_name])
            make_model(
                schema,
                tmp_dir / 'frontend' / f'{model_name}.py',
                {'Model.type': f"type: Literal[{repr(model_name)}]"},
            )

        make_model(
            extractSchema(app_schema, ['StoreState']),
            tmp_dir / f'store.py',
        )

        action_names = extractSchema(app_schema, ['Actions'])['properties'].keys()

        for action_name in action_names:
            schema = extractSchema(app_schema, ['Actions', action_name])
            make_model(
                schema,
                tmp_dir / 'actions' / f'{action_name}.py',
                {'Model.type': f"type: Literal[{repr(action_name)}]"},
            )

    subprocess.check_call(['rsync', '-av', '--delete', f'{tmp_dir}/', dest_dir])
    shutil.rmtree(tmp_dir, ignore_errors=True)


@contextlib.contextmanager
def make_models_parallel():
    with ThreadPoolExecutor() as executor:

        def f(schema, outfile: Path, replace_map: dict[str, str] = {}):
            def g():
                generate_datamodel(schema, outfile, replace_map)

            executor.submit(g)

        yield f


def generate_datamodel(schema, outfile: Path, replace_map: dict[str, str] = {}):
    logging.info(f'Generating {outfile}...')
    try:
        codes = datamodel_codegen(schema)
        codes = replace_type_annotation(codes, 'NotRequired', 'Optional')
        for k, v in replace_map.items():
            codes = replace_definition(codes, k, v)
        codes = re.sub(r'^(from\s+__future__\s+import\s+annotations)', r'\1\nfrom typing import Optional, Literal, TypedDict', codes)
        codes = re.sub(r'^(from typing_extensions.*)', r'', codes, flags=re.MULTILINE)
        codes = re.sub(r'NotRequired', r'Optional', codes, flags=re.MULTILINE)

        outfile.parent.mkdir(parents=True, exist_ok=True)
        outfile.write_text(codes)
    except:
        import traceback

        traceback.print_exc()


def datamodel_codegen(schema):
    p = subprocess.Popen(
        [
            f'{sys.prefix}/bin/datamodel-codegen',
            '--input-file-type',
            'jsonschema',
            '--input',
            '/dev/stdin',
            '--output-model-type',
            'typing.TypedDict',
            '--output',
            '/dev/stdout',
        ],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
    )
    codes_bytes, _ = p.communicate(json.dumps(schema).encode())
    assert p.returncode == 0
    codes = codes_bytes.decode()
    return codes


def load_json_file(path: Path):
    return json.loads(path.read_text())


if __name__ == '__main__':
    main()
