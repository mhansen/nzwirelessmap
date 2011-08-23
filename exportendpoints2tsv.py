#!/usr/bin/env python
"""
A quick script to turn the database into TSV showing pairs of point-to-point
links and information about the links, for importing into Fusion Tables
"""
import sqlite3

conn = sqlite3.connect("prism.sqlite3")
c = conn.cursor()
print "geometry\tlocationid\tlocationname\tlocationheight"

def tsvize(s):
    return s.replace("\t","").replace("\n","").strip()

sql = open("getendpoints.sql").read()
c.execute(sql)
for locationid, locationname, locationheight, lng, lat in c:
    geometry = "<Point><coordinates>%s,%s</coordinates></Point>" % (lng, lat)
    print ("%s"+(3*"\t%s")) % (geometry, locationid, locationname, locationheight)
