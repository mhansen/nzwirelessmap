#!/usr/bin/env python
"""
A quick script to turn the database into TSV showing pairs of point-to-point
links and information about the links, for importing into Fusion Tables
"""
import sqlite3

conn = sqlite3.connect("prism.sqlite3")
c = conn.cursor()
sql = open("getpairs.sql").read()
c.execute(sql)

print "Name\tLicence Type\tLicence ID\tReceiver\tTransmitter\tgeometry"

def tsvize(s):
    return s.replace("\t","").replace("\n","").strip()

for licenceid, clientname, licencetype, rxlng, rxlat, rxalt, txlng, txlat, txalt, rxname, txname in c:
    clientname = tsvize(clientname)
    rxname = tsvize(rxname)
    txname = tsvize(txname)
    licencetype = tsvize(licencetype)
    geometry = """<LineString><coordinates>%s,%s,%s %s,%s,%s</coordinates></LineString>""" % (rxlng, rxlat, rxalt, txlng, txlat, txalt)
    print "%s\t%s\t%s\t%s\t%s\t%s" % (clientname, licencetype, licenceid, rxname, txname, geometry)
