.mode list

SELECT "topClients = [";
SELECT "  '"||clientname||"',"
FROM (
  SELECT 
    LOWER(TRIM(clientname.name)) AS clientname,
    COUNT(*) as count
  FROM receiveconfiguration 
    JOIN transmitconfiguration USING (licenceid) 
    JOIN location AS rxlocation ON rxlocation.locationid = receiveconfiguration.locationid 
    JOIN location AS txlocation ON txlocation.locationid = transmitconfiguration.locationid
    JOIN geographicreference AS rxgeoref ON rxlocation.locationid = rxgeoref.locationid
    JOIN geographicreference AS txgeoref ON txlocation.locationid = txgeoref.locationid
    JOIN licence ON receiveconfiguration.licenceid = licence.licenceid
    JOIN clientname ON licence.clientid = clientname.clientid
    JOIN spectrum ON spectrum.licenceid = licence.licenceid

  -- Each location has heaps of different geographic reference schema, like old
  -- surveying methods. We're only interested in WGS84, because that's the
  -- standard, and what Google Maps uses.
  -- georeferencetypeid = 3 is "WGS84"
  WHERE rxgeoref.georeferencetypeid = 3
    AND txgeoref.georeferencetypeid = 3

    -- Point-to-point links are identified with a licence.licencecode starting with "F"
    -- The "F" is for "Fixed". TV/Radio links start with "R" and "S"
    -- For more licence codes, SQL: `select distinct licencecode, licencetype from licence;`
    AND licence.licencecode LIKE "F%"

    -- Geosynchronous satellites are included in the feed.
    -- When plotted on a map, these are massive lines going from NZ to the equator.
    -- They're interesting, but since the lines are so big and all in one direction,
    -- they look like a comb going across the country, and obscure the terrestrial
    -- links so I've removed them here by removing points on the equator.
    AND txgeoref.northing != 0
    AND rxgeoref.northing != 0
  GROUP BY clientname
  ORDER BY count DESC
  LIMIT 13
);
SELECT "];";
