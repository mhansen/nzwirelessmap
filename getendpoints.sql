-- objective: retrieve all the receivers and transmitter locations,
-- so we can label them on the map with a Placemark.
select

distinct location.locationid,
locationname,
locationheight,
easting,
northing

from location 
join geographicreference using (locationid)

left join transmitconfiguration using (locationid)
left join receiveconfiguration using (locationid)
where (transmitconfigurationid is not null or receiveconfigurationid is not null)

and locationtypeid = 4
and geographicreference.georeferencetypeid = 3
and geographicreference.northing != 0;
