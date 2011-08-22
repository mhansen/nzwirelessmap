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
    <Style id="yellowLineGreenPoly">
      <LineStyle>
        <color>7f00ffff</color>
        <width>1</width>
      </LineStyle>
    </Style>"""

for licenceid, clientname, rxlng, rxlat, rxalt, txlng, txlat, txalt, rxname, txname in c:
    if float(rxlat) == 0:
        rxalt = 35785000 # altitude of geosync satellites
    if float(txlat) == 0:
        txalt = 35785000 # altitude of geosync satellites
    clientname = escape(clientname).strip()
    rxname = escape(rxname).replace("\x12","").strip()
    txname = escape(txname).replace("\x12","").strip()

    print """
    <Placemark>
      <name>%s<br/>Licence ID %s</name>
      <description>rx: %s<br/>tx: %s</description>
      <styleUrl>#yellowLineGreenPoly</styleUrl>
      <LineString>
        <extrude>0</extrude>
        <tessellate>0</tessellate>
        <altitudeMode>clampToGround</altitudeMode>
        <coordinates>%s,%s,%s
%s,%s,%s</coordinates>
      </LineString>
    </Placemark>""" % (clientname, licenceid, rxname, txname, rxlng, rxlat, rxalt, txlng, txlat, txalt)

print """
  </Document>
</kml>
"""
