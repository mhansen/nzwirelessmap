-- Objective: find all the point-to-multipoint links, so we can
-- plot them on a map as placemarks

SELECT
txrx,
trim(spectrum.spectrumstatus),
trim(spectrum.spectrumlabel),
spectrum.spectrumlow,
spectrum.spectrumhigh,
spectrum.frequency,
spectrum.power,
trim(spectrum.polarisation),
trim(spectrum.spectrumtype),
trim(point_location.locationname),
trim(multipoint_location.locationname),
georef.easting,
georef.northing,
"<Point><coordinates>" || georef.easting || "," || georef.northing || "</coordinates></Point>",
point_location.locationheight,
trim(licence.licencetype),
trim(clientname.name),
subquery.licenceid,
point_locationid,
multipoint_locationid,

trim(antenna_make),
trim(antenna_type),
trim(antenna_height),
trim(antenna_azimuth),
trim(antenna_equipment)

FROM (
-- query 1: select point-to-multipoint receivers
SELECT "rx" as txrx,
rxconfig.licenceid as licenceid,
point_location.locationid as point_locationid,
txconfig.locationid as multipoint_locationid,
rxantennamake as antenna_make,
rxantennatype as antenna_type,
rxantennaheight as antenna_height,
rxazimuth as antenna_azimuth,
rxequipment as antenna_equipment

FROM location as point_location
JOIN receiveconfiguration as rxconfig using (locationid)
JOIN transmitconfiguration as txconfig ON txconfig.licenceid = rxconfig.licenceid
JOIN location AS multipoint_location ON multipoint_location.locationid = txconfig.locationid
-- select points where one is a "POINT", and the other isn't
AND point_location.locationtypeid = 4 AND multipoint_location.locationtypeid != 4

UNION

-- query 2: select point-to-multipoint transmitters
SELECT "tx" as txrx,
txconfig.licenceid as licenceid,
point_location.locationid as point_locationid,
rxconfig.locationid as multipoint_locationid,
txantennamake as antenna_make,
txantennatype as antenna_type,
txantennaheight as antenna_height,
txazimuth as antenna_azimuth,
txequipment as antenna_equipment

FROM location as point_location
JOIN transmitconfiguration as txconfig using (locationid)
JOIN receiveconfiguration as rxconfig ON rxconfig.licenceid = txconfig.licenceid
JOIN location AS multipoint_location ON multipoint_location.locationid = rxconfig.locationid
-- select points where one is a "POINT", and the other isn't
AND point_location.locationtypeid = 4 AND multipoint_location.locationtypeid != 4
) as subquery

-- now that we have a list of point-to-multipoint locationids, join this on the
-- other tables to get the rest of the data for each location

JOIN location AS point_location ON point_location.locationid = point_locationid
JOIN location AS multipoint_location ON multipoint_location.locationid = multipoint_locationid
-- 10 locations don't have geographicreferences, so do a left join here to include them
LEFT JOIN geographicreference as georef ON point_location.locationid = georef.locationid
JOIN licence ON licence.licenceid = subquery.licenceid
LEFT JOIN spectrum ON spectrum.licenceid = subquery.licenceid
JOIN clientname USING (clientid)

-- Select only WGS84 LatLngs
WHERE georef.georeferencetypeid = 3
ORDER BY point_locationid
;
