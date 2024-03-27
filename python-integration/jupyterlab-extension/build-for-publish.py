import argparse
import json
import subprocess
import tempfile
from pathlib import Path

package = json.loads(Path('./package.json').read_text())


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--rebuild-dependencies', '-r', action='store_true', help='Rebuild dependencies')
    args = parser.parse_args()

    if args.rebuild_dependencies:
        subprocess.check_call(['make', '-C', '../../app', '-j', 'lib'])
        subprocess.check_call(['jlpm', 'build:prod'])

    with tempfile.TemporaryDirectory() as tmp:
        tmp_path = Path(tmp)
        write_working_tree_to_dir(tmp_path)
        subprocess.check_call(['rsync', '-a', './stellar_globe_jupyterlab_extension/', tmp_path / 'stellar_globe_jupyterlab_extension'])
        subprocess.check_call(['tar', 'cvzf', f'./dist/stellar_globe_jupyterlab_extension-{package['version']}.tar.gz', '-C', tmp_path, '.'])


def write_working_tree_to_dir(dir: Path):
    # Write the current Git working tree to the specified directory.
    # Copy files that are not included in gitignore.
    with subprocess.Popen(['git', 'ls-files', '-z'], stdout=subprocess.PIPE) as p:
        assert p.stdout
        files = p.stdout.read()
        for line in files.split(b'\0')[:-1]:
            path = Path(line.decode().strip())
            if path.is_dir():
                continue
            dest_path = dir / path
            dest_path.parent.mkdir(parents=True, exist_ok=True)
            with path.open('rb') as src, dest_path.open('wb') as dest:
                dest.write(src.read())


if __name__ == '__main__':
    main()
