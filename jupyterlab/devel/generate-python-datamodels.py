import json
import logging
import re
import shutil
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path


def main():
    logging.basicConfig(level=logging.INFO)
    models_dir = Path('./stellarglobe_jupyterlab/models')
    app_schema = load_json_file(Path('../app/devel/jsonschema/root.json'))
    jupyter_schema = load_json_file(Path('./devel/jsonschema/root.json'))
    shutil.rmtree(models_dir, ignore_errors=True)

    # for model_name in jupyter_schema['properties'].keys():
    #     generate_datamodel(
    #         extractSchema(jupyter_schema, [model_name]),
    #         models_dir / f'{model_name}.py',
    #     )

    action_names = extractSchema(app_schema, ['Actions'])['properties'].keys()
    def process_action(action_name):
        schema = extractSchema(app_schema, ['Actions', action_name])
        generate_datamodel(
            schema,
            models_dir / 'actions' / f'{action_name}.py',
        )
    with ThreadPoolExecutor() as executor:
        executor.map(process_action, action_names)
    

def anyOf_to_properties(schema):
    return {'properties': {p['properties']['type']['const']: p for p in schema['anyOf']}}


def generate_datamodel_map(root, parent, outdir: Path):
    outdir.mkdir(exist_ok=True, parents=True)
    with ThreadPoolExecutor(len(parent['properties'])) as executor:

        def run(k):
            generate_datamodel(extractSchema(parent, [k]), outdir / f'{k}.py')

        executor.map(run, parent['properties'].keys())


def load_json_file(path: Path):
    return json.loads(path.read_text())


def generate_datamodel(schema, outfile: Path):
    logging.info(f'Generating {outfile}...')
    outfile.parent.mkdir(parents=True, exist_ok=True)
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
    codes = codes_bytes.decode()
    codes = re.sub(r'(from\s+__future__\s+import\s+annotations)', r'\1\nfrom typing import Optional, Literal', codes)
    codes = re.sub(r'(\s*\w+:\s*)NotRequired\[', r'\1Optional[', codes)
    codes = re.sub(r'    type: Optional\[str\]\n$', fr'    type: Literal["{outfile.stem}"]', codes)
    codes = re.sub(r'from typing_extensions ', r'from typing ', codes)
    codes = re.sub(r'(from typing import .*)NotRequired(.*)', r'\1Any\2', codes)

    assert p.returncode == 0
    outfile.write_text(codes)


def extractSchema(schema, routes: list[str]):
    # machine translation of devel/generate-js-type-validators.js

    def dig(schema, routes, definitions=None):
        if definitions is None:
            definitions = {}
        definitions = {**schema.get('definitions', {}), **definitions}
        schema = dereference(schema, definitions)

        if len(routes) == 0:
            return schema
        else:
            route, *rest = routes
            nextSchema = schema['properties'][route]
            return dig(nextSchema, rest, definitions)

    def isRef(obj):
        return isinstance(obj, dict) and '$ref' in obj

    def dereference(obj, definitions):
        if isRef(obj):
            ref = obj['$ref']
            assert ref.startswith('#/definitions/')
            return definitions[definitionKey(ref)]
        return obj

    def definitionKey(ref):
        return ref[len('#/definitions/') :]

    def cleanupDefinitions(schema, definitions):
        used_definitions = set()

        def walk(o):
            nonlocal used_definitions
            if isRef(o):
                key = definitionKey(o['$ref'])
                if key not in used_definitions:
                    used_definitions.add(key)
                    walk(definitions[key])
            elif isinstance(o, list):
                for c in o:
                    walk(c)
            elif isinstance(o, dict):
                for k, v in o.items():
                    if k != 'definitions':
                        walk(v)

        walk(schema)
        return {k: definitions[k] for k in used_definitions}

    target = dig(schema, routes)
    newSchema = {**target, 'definitions': cleanupDefinitions(target, schema.get('definitions', {}))}
    return newSchema


if __name__ == '__main__':
    main()
