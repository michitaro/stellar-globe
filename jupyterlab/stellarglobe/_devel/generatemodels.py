from concurrent.futures import ThreadPoolExecutor
import re
import logging
import json
from pathlib import Path
import shutil
import subprocess


def main():
    logging.basicConfig(level=logging.INFO)
    models_dir = Path('./stellarglobe/_models')
    root = load_json_file(Path('./jsonschema/root.json'))
    shutil.rmtree(models_dir, ignore_errors=True)
    generate_datamodel_map(root, extractSchema(root, ['MessageToJS']), models_dir / 'MessageToJS')
    generate_datamodel_map(root, extractSchema(root, ['MessageToPython']), models_dir / 'MessageToPython')
    generate_datamodel_map(root, extractSchema(root, ['LayerProps']), models_dir / 'LayerProps')
    generate_datamodel_map(root, anyOf_to_properties(extractSchema(root, ['LayerProps', 'TractTileLayer', 'colorParams'])), models_dir / 'TractTileLayerColorParams')

    for layer_name in extractSchema(root, ['LayerCallbacks'])['properties'].keys():
        schema = extractSchema(root, ['LayerCallbacks', layer_name])
        for event_name, event_type in schema.get('properties', {}).items():
            generate_datamodel({'definitions': {}, **event_type}, models_dir / f'LayerCallbacks/{layer_name}/{event_name}.py')


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
            './.venv-jsonschema/bin/datamodel-codegen',
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

    assert p.returncode == 0
    outfile.write_text(codes)


def extractSchema(schema, routes: list[str]):
    # machine translation of devel/genearete-validation-codes.js

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
