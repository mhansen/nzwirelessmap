#!/usr/bin/env python
"""
A quick script to turn the database into KML showing pairs of point-to-point links
"""
import sys
import sqlite3
from xml.sax.saxutils import escape

conn = sqlite3.connect("prism.sqlite3")
c = conn.cursor()
sql = open("getpairs.sql").read()
c.execute(sql)

print """<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Paths</name>
    <description>Examples of paths. Note that the tessellate tag is by default
      set to 0. If you want to create tessellated lines, they must be authored
      (or edited) directly in KML.</description>
    <Style id="p2plink">
      <LineStyle>
        <color>7f00ff00</color>
        <width>1</width>
      </LineStyle>
    </Style>"""

def xmlize(s):
    return escape(s).replace("\x12","").strip()

for licenceid, clientname, licencetype, rxlng, rxlat, rxalt, txlng, txlat, txalt, rxname, txname, ra,rb,rc,rd,re,ta,tb,tc,td,te in c:
    if float(rxlat) == 0:
        rxalt = 35785000 # altitude of geosync satellites
    if float(txlat) == 0:
        txalt = 35785000 # altitude of geosync satellites
    clientname = escape(clientname).strip()
    rxname = xmlize(rxname)
    txname = xmlize(txname)
    licencetype = xmlize(licencetype)

    print """
    <Placemark>
      <name>%s<br/>%s</name>
      <description>Licence ID: %s<br/>Receiver: %s<br/>Transmitter: %s</description>
      <styleUrl>#p2plink</styleUrl>
      <LineString>
        <extrude>0</extrude>
        <tessellate>0</tessellate>
        <altitudeMode>clampToGround</altitudeMode>
        <coordinates>%s,%s,%s
%s,%s,%s</coordinates>
      </LineString>
    </Placemark>""" % (clientname, licencetype, licenceid, rxname, txname, rxlng, rxlat, rxalt, txlng, txlat, txalt)

print """
  </Document>
</kml>
"""
