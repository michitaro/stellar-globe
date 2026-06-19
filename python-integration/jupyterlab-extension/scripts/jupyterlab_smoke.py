from __future__ import annotations

import argparse
import contextlib
import json
import os
import shutil
import subprocess
import sys
import tempfile
import time
import urllib.request
import venv
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable


REPO_ROOT = Path(__file__).resolve().parents[3]
EXTENSION_DIR = Path(__file__).resolve().parents[1]
BRIDGE_DIR = EXTENSION_DIR / 'packages' / 'jupyterlab-bridge'
PYTHON_PACKAGE_DIR = REPO_ROOT / 'python-integration' / 'python'
SMOKE_NOTEBOOK = EXTENSION_DIR / 'e2e-smoke.ipynb'
DEFAULT_REACT = '18.2.0'
DEFAULT_REACT_DOM = '18.2.0'
DEFAULT_REACT_TYPES = '18.2.55'
DEFAULT_REACT_DOM_TYPES = '18.2.19'
REACT_19_TYPES = '19.1.2'


@dataclass
class SmokeConfig:
    python_jupyterlab_spec: str
    js_jupyterlab_spec: str
    js_services_spec: str
    builder_jupyterlab_spec: str
    react_version: str
    react_dom_version: str
    port: int
    prepare_local_packages: bool
    install_playwright: bool


def parse_args() -> SmokeConfig:
    parser = argparse.ArgumentParser(description='Run the JupyterLab smoke test for the local extension.')
    parser.add_argument('--python-jupyterlab-spec', default='~=4.6.0')
    parser.add_argument('--js-jupyterlab-spec', default='^4.0.0')
    parser.add_argument('--js-services-spec', default=None)
    parser.add_argument('--builder-jupyterlab-spec', default=None)
    parser.add_argument('--react-version', default=DEFAULT_REACT)
    parser.add_argument('--react-dom-version', default=DEFAULT_REACT_DOM)
    parser.add_argument('--port', type=int, default=8877)
    parser.add_argument('--skip-prepare-local-packages', action='store_true')
    parser.add_argument('--install-playwright', action='store_true')
    args = parser.parse_args()
    return SmokeConfig(
        python_jupyterlab_spec=args.python_jupyterlab_spec,
        js_jupyterlab_spec=args.js_jupyterlab_spec,
        js_services_spec=args.js_services_spec or args.js_jupyterlab_spec,
        builder_jupyterlab_spec=args.builder_jupyterlab_spec or args.js_jupyterlab_spec,
        react_version=args.react_version,
        react_dom_version=args.react_dom_version,
        port=args.port,
        prepare_local_packages=not args.skip_prepare_local_packages,
        install_playwright=args.install_playwright,
    )


def main() -> int:
    config = parse_args()
    run_smoke(config)
    return 0


def run_smoke(config: SmokeConfig) -> None:
    if config.prepare_local_packages:
        prepare_local_packages()

    with temporary_manifest_overrides(config):
        with temporary_environment(config.port) as env_ctx:
            install_python_packages(env_ctx.python_bin, config.python_jupyterlab_spec)
            jlpm_bin = env_ctx.python_bin.parent / 'jlpm'
            run([str(jlpm_bin)], cwd=EXTENSION_DIR)
            if config.install_playwright:
                run(['npx', 'playwright', 'install', '--with-deps', 'chromium'], cwd=EXTENSION_DIR)
            verify_labextension(env_ctx.python_bin)
            start_and_run_playwright(env_ctx, config.port)


def prepare_local_packages() -> None:
    commands = [
        ['make', '-C', str(REPO_ROOT / 'stellar-globe'), 'build'],
        ['make', '-C', str(REPO_ROOT / 'react-draggable-dialog'), 'build'],
        ['make', '-C', str(REPO_ROOT / 'react-stellar-globe'), 'build'],
        ['make', '-C', str(REPO_ROOT / 'app'), 'lib'],
        ['make', '-C', str(PYTHON_PACKAGE_DIR), 'setup', 'datamodel'],
    ]
    for command in commands:
        run(command, cwd=REPO_ROOT)


@dataclass
class TemporaryEnvironment:
    temp_dir: Path
    workspace_dir: Path
    python_bin: Path
    base_url: str
    log_path: Path


@contextlib.contextmanager
def temporary_environment(port: int):
    temp_dir = Path(tempfile.mkdtemp(prefix='stellar-globe-jupyterlab-smoke-'))
    workspace_dir = temp_dir / 'workspace'
    workspace_dir.mkdir(parents=True, exist_ok=True)
    shutil.copy2(SMOKE_NOTEBOOK, workspace_dir / SMOKE_NOTEBOOK.name)

    venv_dir = temp_dir / 'venv'
    venv.EnvBuilder(with_pip=True).create(venv_dir)
    python_bin = venv_dir / 'bin' / 'python'
    log_path = temp_dir / 'jupyterlab.log'
    try:
        yield TemporaryEnvironment(
            temp_dir=temp_dir,
            workspace_dir=workspace_dir,
            python_bin=python_bin,
            base_url=f'http://127.0.0.1:{port}',
            log_path=log_path,
        )
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)


def install_python_packages(python_bin: Path, python_jupyterlab_spec: str) -> None:
    run([str(python_bin), '-m', 'pip', 'install', '--upgrade', 'pip'])
    run([
        str(python_bin), '-m', 'pip', 'install',
        f'jupyterlab{python_jupyterlab_spec}',
        'ipykernel',
    ])
    run([str(python_bin), '-m', 'pip', 'install', '-e', str(PYTHON_PACKAGE_DIR)])
    run([str(python_bin), '-m', 'pip', 'install', '-e', str(EXTENSION_DIR)])


def verify_labextension(python_bin: Path) -> None:
    result = run([str(python_bin), '-m', 'jupyter', 'labextension', 'list'], capture_output=True)
    output = '\n'.join(part for part in [result.stdout, result.stderr] if part)
    if '@stellar-globe/jupyterlab-extension' not in output:
        raise RuntimeError(f'labextension is not registered:\n{output}')


def start_and_run_playwright(env_ctx: TemporaryEnvironment, port: int) -> None:
    server_command = [
        str(env_ctx.python_bin), '-m', 'jupyter', 'lab',
        '--no-browser',
        f'--ServerApp.root_dir={env_ctx.workspace_dir}',
        '--ServerApp.token=',
        '--ServerApp.password=',
        f'--ServerApp.port={port}',
    ]
    with env_ctx.log_path.open('w', encoding='utf-8') as log_file:
        process = subprocess.Popen(
            server_command,
            cwd=env_ctx.workspace_dir,
            stdout=log_file,
            stderr=subprocess.STDOUT,
            text=True,
        )
        try:
            wait_for_server(env_ctx.base_url, env_ctx.log_path)
            env = os.environ.copy()
            env['JUPYTERLAB_SMOKE_BASE_URL'] = env_ctx.base_url
            run(['npx', 'playwright', 'test', '--config', 'playwright.config.js'], cwd=EXTENSION_DIR, env=env)
        finally:
            process.terminate()
            try:
                process.wait(timeout=20)
            except subprocess.TimeoutExpired:
                process.kill()
                process.wait(timeout=20)


@contextlib.contextmanager
def temporary_manifest_overrides(config: SmokeConfig):
    manifest_paths = [
        EXTENSION_DIR / 'package.json',
        BRIDGE_DIR / 'package.json',
        EXTENSION_DIR / 'yarn.lock',
        BRIDGE_DIR / 'yarn.lock',
    ]
    original_texts: dict[Path, str | None] = {}
    for path in manifest_paths:
        original_texts[path] = path.read_text(encoding='utf-8') if path.exists() else None

    try:
        override_extension_manifest(config)
        override_bridge_manifest(config)
        yield
    finally:
        for path, original_text in original_texts.items():
            if original_text is None:
                path.unlink(missing_ok=True)
            else:
                path.write_text(original_text, encoding='utf-8')


def override_extension_manifest(config: SmokeConfig) -> None:
    path = EXTENSION_DIR / 'package.json'
    data = json.loads(path.read_text(encoding='utf-8'))
    dependencies = data['dependencies']
    dev_dependencies = data['devDependencies']
    dependencies['@jupyterlab/application'] = config.js_jupyterlab_spec
    dependencies['@jupyterlab/apputils'] = config.js_jupyterlab_spec
    dependencies['@jupyterlab/notebook'] = config.js_jupyterlab_spec
    dependencies['@jupyterlab/services'] = config.js_services_spec
    dependencies['react'] = config.react_version
    dependencies['react-dom'] = config.react_dom_version
    dev_dependencies['@jupyterlab/builder'] = config.builder_jupyterlab_spec
    dev_dependencies['@types/react'] = infer_react_types_version(config.react_version)
    dev_dependencies['@types/react-dom'] = infer_react_dom_types_version(config.react_dom_version)
    path.write_text(json.dumps(data, indent=4) + '\n', encoding='utf-8')


def override_bridge_manifest(config: SmokeConfig) -> None:
    path = BRIDGE_DIR / 'package.json'
    data = json.loads(path.read_text(encoding='utf-8'))
    dependencies = data['dependencies']
    dependencies['@jupyterlab/application'] = config.js_jupyterlab_spec
    dependencies['@jupyterlab/apputils'] = config.js_jupyterlab_spec
    dependencies['@jupyterlab/notebook'] = config.js_jupyterlab_spec
    path.write_text(json.dumps(data, indent=4) + '\n', encoding='utf-8')


def infer_react_types_version(react_version: str) -> str:
    if react_version.startswith('19.'):
        return REACT_19_TYPES
    return DEFAULT_REACT_TYPES


def infer_react_dom_types_version(react_dom_version: str) -> str:
    if react_dom_version.startswith('19.'):
        return REACT_19_TYPES
    return DEFAULT_REACT_DOM_TYPES


def wait_for_server(base_url: str, log_path: Path) -> None:
    deadline = time.time() + 120
    while time.time() < deadline:
        if is_port_open(base_url):
            return
        time.sleep(1)
    log_text = log_path.read_text(encoding='utf-8') if log_path.exists() else ''
    raise RuntimeError(f'JupyterLab server did not start in time.\n{log_text}')


def is_port_open(base_url: str) -> bool:
    try:
        with urllib.request.urlopen(base_url, timeout=2) as response:
            return response.status < 500
    except Exception:
        return False


def run(command: Iterable[str], *, cwd: Path | None = None, env: dict[str, str] | None = None, capture_output: bool = False) -> subprocess.CompletedProcess[str]:
    result = subprocess.run(
        list(command),
        cwd=cwd,
        env=env,
        text=True,
        capture_output=capture_output,
        check=False,
    )
    if result.returncode != 0:
        raise RuntimeError(render_failure(command, result))
    return result


def render_failure(command: Iterable[str], result: subprocess.CompletedProcess[str]) -> str:
    stdout = result.stdout or ''
    stderr = result.stderr or ''
    return '\n'.join([
        f'Command failed: {" ".join(command)}',
        f'Exit code: {result.returncode}',
        stdout,
        stderr,
    ])


if __name__ == '__main__':
    raise SystemExit(main())
