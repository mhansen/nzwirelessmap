-- Objective: find all the point-to-multipoint links, so we can
-- plot them on a map as placemarks

-- query 1: select point receivers
SELECT
point_location.locationname,
point_georef.northing,
point_georef.easting,
multipoint_location.locationname 

FROM location as point_location

JOIN receiveconfiguration as rxconfig using (locationid)

JOIN transmitconfiguration as txconfig
ON txconfig.licenceid = rxconfig.licenceid

JOIN location AS multipoint_location
ON multipoint_location.locationid = txconfig.locationid

JOIN geographicreference AS point_georef
ON point_georef.locationid = point_location.locationid

-- select only WGS84 datum LatLngs
WHERE point_georef.georeferencetypeid = 3

-- select points where one is a "POINT", and the other isn't
AND point_location.locationtypeid = 4 
AND multipoint_location.locationtypeid != 4

UNION ALL

-- query 2: select point transmitters
SELECT
point_location.locationid,
point_georef.northing,
point_georef.easting,
multipoint_location.locationid 


FROM location as point_location

JOIN transmitconfiguration as txconfig using (locationid)

JOIN receiveconfiguration as rxconfig
ON rxconfig.licenceid = txconfig.licenceid

JOIN location AS multipoint_location
ON multipoint_location.locationid = rxconfig.locationid

JOIN geographicreference AS point_georef
ON point_georef.locationid = point_location.locationid

-- select only WGS84 datum LatLngs
WHERE point_georef.georeferencetypeid = 3

-- select points where one is a "POINT", and the other isn't
AND point_location.locationtypeid = 4 
AND multipoint_location.locationtypeid != 4
;
