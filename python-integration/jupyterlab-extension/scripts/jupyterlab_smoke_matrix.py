from __future__ import annotations

import argparse
from dataclasses import replace

from jupyterlab_smoke import DEFAULT_REACT, DEFAULT_REACT_DOM, SmokeConfig, prepare_local_packages, run_smoke


DEFAULT_MINORS = ['4.0', '4.1', '4.2', '4.3', '4.4', '4.5', '4.6']


def parse_args():
    parser = argparse.ArgumentParser(description='Run the JupyterLab smoke test matrix.')
    parser.add_argument('--jupyterlab-minor', action='append', dest='jupyterlab_minors')
    parser.add_argument('--react-version', default=DEFAULT_REACT)
    parser.add_argument('--react-dom-version', default=DEFAULT_REACT_DOM)
    parser.add_argument('--install-playwright', action='store_true')
    parser.add_argument('--fail-fast', action='store_true')
    args = parser.parse_args()
    return args


def main() -> int:
    args = parse_args()
    minors = args.jupyterlab_minors or DEFAULT_MINORS
    base_config = SmokeConfig(
        python_jupyterlab_spec='~=4.6.0',
        js_jupyterlab_spec='~4.6.0',
        js_services_spec='~7.6.0',
        builder_jupyterlab_spec='^4.0.0',
        react_version=args.react_version,
        react_dom_version=args.react_dom_version,
        port=8877,
        prepare_local_packages=False,
        install_playwright=args.install_playwright,
    )

    prepare_local_packages()

    results: list[tuple[str, str, str]] = []
    install_playwright = args.install_playwright
    for index, minor in enumerate(minors):
        port = 8877 + index
        spec = f'~={minor}.0'
        js_spec = f'~{minor}.0'
        services_spec = services_spec_for_minor(minor)
        config = replace(
            base_config,
            python_jupyterlab_spec=spec,
            js_jupyterlab_spec=js_spec,
            js_services_spec=services_spec,
            builder_jupyterlab_spec='^4.0.0',
            port=port,
            install_playwright=install_playwright,
        )
        try:
            run_smoke(config)
        except Exception as error:
            results.append((minor, 'FAIL', str(error).splitlines()[0]))
            if args.fail_fast:
                break
        else:
            results.append((minor, 'PASS', ''))
        install_playwright = False

    print('| JupyterLab | Result | Note |')
    print('| --- | --- | --- |')
    for minor, result, note in results:
        print(f'| {minor} | {result} | {note} |')

    return 0 if all(result == 'PASS' for _, result, _ in results) else 1


def services_spec_for_minor(minor: str) -> str:
    if minor in {'4.0', '4.1', '4.2'}:
        return f'~{minor}.0'
    return f'~7.{minor.split(".")[1]}.0'


if __name__ == '__main__':
    raise SystemExit(main())
