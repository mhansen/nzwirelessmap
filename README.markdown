The goal: Visualise the wireless network links of New Zealand.

The data's available in the Radio Spectrum Management database, available from
http://www.rsm.govt.nz/ in MS Access format.

I've exported the DB into a SQLite file, available here.

To make a TSV file for import into Fusion Tables,

    python export2tsv.py

To make a KML file for Google Earth,

    python export2kml.py

You can browse the map generated at http://wirelessmap.markhansen.co.nz/.
