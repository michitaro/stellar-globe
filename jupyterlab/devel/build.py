import json
import os
import subprocess
from contextlib import contextmanager

@contextmanager
def update_gitignore():
    gitignore_path = os.path.join(os.getcwd(), '.gitignore')
    with open(gitignore_path, 'r') as f:
        original_lines = f.readlines()

    updated_lines = ['#' + line if 'stellarglobe/labextension' in line or '/stellarglobe/_models' in line else line for line in original_lines]

    with open(gitignore_path, 'w') as f:
        f.writelines(updated_lines)

    try:
        yield
    finally:
        with open(gitignore_path, 'w') as f:
            f.writelines(original_lines)

@contextmanager
def update_package_json():
    package_json_path = os.path.join(os.getcwd(), 'package.json')
    with open(package_json_path, 'r') as f:
        data = json.load(f)
        original_dependencies = data['dependencies'].copy()

    for key, value in data['dependencies'].items():
        if value.startswith('link:'):
            relative_path = value.split('link:')[1]
            absolute_path = os.path.abspath(os.path.join(os.getcwd(), relative_path))
            data['dependencies'][key] = f'link:{absolute_path}'

    with open(package_json_path, 'w') as f:
        json.dump(data, f, indent=4)

    try:
        yield
    finally:
        with open(package_json_path, 'r') as f:
            data = json.load(f)
        data['dependencies'] = original_dependencies
        with open(package_json_path, 'w') as f:
            json.dump(data, f, indent=4)

if __name__ == "__main__":
    with update_gitignore(), update_package_json():
        subprocess.run(['python', '-m', 'build', '-x', '-n'], check=True)
