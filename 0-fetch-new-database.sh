#!/bin/bash
set -e
set -x
wget -O prism.zip http://www.rsm.govt.nz/cms/pdf-library/resource-library/spectrum-search-lite/spectrum-search-lite-database
unzip -o prism.zip
rm prism.zip

echo "done! database downloaded to: prism.mdb"
