from setuptools import find_packages, setup

setup(
    name='hscmap',
    packages=find_packages(where='src'),
    package_dir={'': 'src'},
    install_requires=[],
    extras_require={
        'dev': [
            'pytest',
            'pytest-cov',
            'pytest-watch',
            'pandas',
            'numpy',
            'requests',
            'datamodel-code-generator==0.25.*',
            'build',
        ],
        'hscmapserver': [
            'websockets',
        ],
    },
)
