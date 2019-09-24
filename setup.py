# -*- coding: utf-8 -*-
from setuptools import setup, find_packages

with open('requirements.txt') as f:
	install_requires = f.read().strip().split('\n')

# get version from __version__ variable in gti_eg_education/__init__.py
from gti_eg_education import __version__ as version

setup(
	name='gti_eg_education',
	version=version,
	description='Customizaton for Gti-eg',
	author='Mainul Islam',
	author_email='mainulkhan94@gmail.com',
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
