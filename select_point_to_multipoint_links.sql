-- Objective: find all the point-to-multipoint links, so we can
-- plot them on a map as placemarks

SELECT
txrx,
point_location.locationname,
multipoint_location.locationname,
georef.easting,
georef.northing,
trim(clientname.name),
subquery.licenceid,
point_locationid,
multipoint_locationid

FROM (
-- query 1: select point receivers
SELECT "rx" as txrx,
rxconfig.licenceid as licenceid,
point_location.locationid as point_locationid,
txconfig.locationid as multipoint_locationid

FROM location as point_location

JOIN receiveconfiguration as rxconfig using (locationid)

JOIN transmitconfiguration as txconfig
ON txconfig.licenceid = rxconfig.licenceid

JOIN location AS multipoint_location
ON multipoint_location.locationid = txconfig.locationid
-- select points where one is a "POINT", and the other isn't
AND point_location.locationtypeid = 4 
AND multipoint_location.locationtypeid != 4

UNION ALL

-- query 2: select point transmitters
SELECT "tx" as txrx,
txconfig.licenceid as licenceid,
point_location.locationid as point_locationid,
rxconfig.locationid as multipoint_locationid

FROM location as point_location

JOIN transmitconfiguration as txconfig using (locationid)

JOIN receiveconfiguration as rxconfig
ON rxconfig.licenceid = txconfig.licenceid

JOIN location AS multipoint_location
ON multipoint_location.locationid = rxconfig.locationid
-- select points where one is a "POINT", and the other isn't
AND point_location.locationtypeid = 4 
AND multipoint_location.locationtypeid != 4
) as subquery

JOIN location AS point_location 
ON point_location.locationid = point_locationid

JOIN location AS multipoint_location 
ON multipoint_location.locationid = multipoint_locationid

JOIN geographicreference as georef
ON point_location.locationid = georef.locationid

JOIN licence
ON licence.licenceid = subquery.licenceid

JOIN clientname USING (clientid)

-- Select only WGS84 LatLngs
WHERE georef.georeferencetypeid = 3
ORDER BY point_locationid
;
