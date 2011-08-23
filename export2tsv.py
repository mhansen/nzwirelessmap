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

print "geometry\tName\tLicence Type\tLicence ID\tReceiver\tTransmitter\t" + "rxantennamake\trxantennatype\trxantennaheight\trxazimuth\trxequipment\t" + "txantennamake\ttxantennatype\ttxantennaheight\ttxazimuth\ttxequipment\t" + "rxheight\ttxheight"

def tsvize(s):
    return s.replace("\t","").replace("\n","").strip()

for licenceid, clientname, licencetype, rxlng, rxlat, rxheight, txlng, txlat, txheight, rxname, txname, rxantennamake, rxantennatype, rxantennaheight, rxazimuth, rxequipment, txantennamake, txantennatype, txantennaheight, txazimuth, txequipment in c:

    clientname = tsvize(clientname)
    rxname = tsvize(rxname)
    txname = tsvize(txname)
    licencetype = tsvize(licencetype)
    geometry = """<LineString><coordinates>%s,%s,%s %s,%s,%s</coordinates></LineString>""" % (rxlng, rxlat, rxheight, txlng, txlat, txheight)
    print (("%s\t"*17)+"%s") % (geometry, clientname, licencetype, licenceid, rxname, txname, rxantennamake, rxantennatype, rxantennaheight, rxazimuth, rxequipment, txantennamake, txantennatype, txantennaheight, txazimuth, txequipment, rxheight, txheight)
