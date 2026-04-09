set -uex
cd $(dirname $0)
python3 ./tools/check_dependency_freshness.py
make -C stellar-globe
make -C react-stellar-globe
make -C react-draggable-dialog
make -C app node_modules
make -C app -j
make -C python-integration/python setup datamodel build
make -C python-integration/jupyterlab-extension setup build
make -C python-integration/jupyterlite setup build
