#!/bin/bash
set -e
set -x
rm -f prism.sqlite3
java -jar lib/mdb-sqlite.jar prism.mdb prism.sqlite3

# by default, the generated database has no idea what it looks like, so it
# makes all kinds of bad decisions when planning queries. We ask the database
# to analyze itself, so it can make an informed decision about how to do
# massive JOINs.
echo "analyze main;" | sqlite3 prism.sqlite3 
echo "done! converted prism.mdb to prism.sqlite3"
