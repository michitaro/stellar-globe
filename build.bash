set -e
cd $(dirname $0)
make -C /src/typescript-typevalidator
make -C /src/stellar-globe node_modules
make -C /src/react-stellar-globe
make -C /src/app node_modules
make -C /src/app -j
make -C /src/python-integration/python setup datamodel build base_python=python3
make -C /src/python-integration/jupyterlab-extension setup build base_python=python3
make -C /src/python-integration/jupyterlite setup build base_python=python3
