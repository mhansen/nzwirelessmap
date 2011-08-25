-- Objective: find the pairs of towers in point to point links, so we can plot
-- them on a map.
select 
receiveconfiguration.licenceid, 
clientname.name,
licence.licencetype,
rxgeoref.easting,
rxgeoref.northing,
rxlocation.locationheight,
txgeoref.easting,
txgeoref.northing,
txlocation.locationheight,
rxlocation.locationname,
txlocation.locationname,

receiveconfiguration.rxantennamake,
receiveconfiguration.rxantennatype,
receiveconfiguration.rxantennaheight,
receiveconfiguration.rxazimuth,
receiveconfiguration.rxequipment,

transmitconfiguration.txantennamake,
transmitconfiguration.txantennatype,
transmitconfiguration.txantennaheight,
transmitconfiguration.txazimuth,
transmitconfiguration.txequipment

from receiveconfiguration 

JOIN transmitconfiguration 
using (licenceid) 

JOIN location as rxlocation 
on rxlocation.locationid = receiveconfiguration.locationid 

JOIN location as txlocation 
on txlocation.locationid = transmitconfiguration.locationid

JOIN geographicreference as rxgeoref 
on rxlocation.locationid = rxgeoref.locationid

JOIN geographicreference as txgeoref 
on txlocation.locationid = txgeoref.locationid

JOIN licence
on receiveconfiguration.licenceid = licence.licenceid

JOIN clientname
on licence.clientid = clientname.clientid

-- Each location has heaps of different geographic reference schema, like old
-- surveying methods. We're only interested in WGS84, because that's the
-- standard, and what Google Maps uses.
-- georeferencetypeid = 3 is "WGS84"
where rxgeoref.georeferencetypeid = 3
and txgeoref.georeferencetypeid = 3

-- locationtypeid = 3 is a "DEFINED AREA" type link
-- locationtypeid = 4 is a "POINT" type link (latlng)
-- locationtypeid = 5 is a "NAME" type link (covering a large area)
-- locationtypeid = 9 is a "MULTIPLE POINTS" type area (usually four latlngs in a square)
-- we're only interested in "POINT" type links. "MULTIPLE POINT" links cover a
-- large square area, and obscure real point-to-point links

and txlocation.locationtypeid = 4 -- select only "POINT"-to
and rxlocation.locationtypeid = 4 -- "POINT" links

-- Geosynchronous satellites are included in the feed.
-- When plotted on a map, these are massive lines going from NZ to the equator.
-- They're interesting, but since the lines are so big and all in one direction,
-- they look like a comb going across the country, and obscure the terrestrial
-- links so I've removed them here by removing points on the equator.
and txgeoref.northing != 0
and rxgeoref.northing != 0
;
