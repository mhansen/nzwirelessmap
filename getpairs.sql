-- objective: find the pairs of towers in point to point links, so we can plot
-- them on a map.
select 
receiveconfiguration.licenceid, 
rxgeoref.easting,
rxgeoref.northing,
txgeoref.easting,
txgeoref.northing,
rxlocation.locationname,
txlocation.locationname

from receiveconfiguration 

JOIN transmitconfiguration 
using (licenceid) 

JOIN location as rxlocation 
on rxlocation.locationid = receiveconfiguration.locationid 

JOIN location as txlocation 
on txlocation.locationid = transmitconfiguration.locationid

-- each location has heaps of different geographic reference schema, like old
-- surveying methods. We're only interested in WGS84, because that's the
-- standard, and what Google Maps uses.

JOIN geographicreference as rxgeoref 
on rxlocation.locationid = rxgeoref.locationid

JOIN geographicreference as txgeoref 
on txlocation.locationid = txgeoref.locationid

where rxgeoref.georeferencetypeid = 3 -- use the WGS84 datum for Google Maps
and txgeoref.georeferencetypeid = 3 -- use the WGS84 datum for Google Maps
;
