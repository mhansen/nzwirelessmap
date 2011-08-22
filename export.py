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
        <width>4</width>
      </LineStyle>
      <PolyStyle>
        <color>7f00ff00</color>
      </PolyStyle>
    </Style>"""

for licenceid, rxlng, rxlat, rxalt, txlng, txlat, txalt, rxname, txname in c:
    print """
    <Placemark>
      <name>Licence ID %s</name>
      <description>rx: %s, tx: %s</description>
      <styleUrl>#yellowLineGreenPoly</styleUrl>
      <LineString>
        <extrude>1</extrude>
        <altitudeMode>absolute</altitudeMode>
        <coordinates>
            %s,%s,%s
            %s,%s,%s
        </coordinates>
      </LineString>
    </Placemark>""" % (licenceid, escape(rxname).replace("\x12",""), escape(txname).replace("\x12",""), rxlng, rxlat, rxalt, txlng, txlat, txalt)

print """
  </Document>
</kml>
"""
