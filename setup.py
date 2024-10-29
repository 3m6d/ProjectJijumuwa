# setup.py
from setuptools import setup, find_packages

setup(
    name='ProjectJijumuwa',
    version='0.1',
    packages=find_packages(),
    install_requires=[
        'torch',
        'transformers',
        'datasets',
        'sentencepiece',
    ],
)
