.headers on
.mode csv
-- Objective: find the pairs of towers in point to point links, so we can plot
-- them on a map.
select 
-- rxlocation.locationheight as rx_height,
-- txlocation.locationheight as tx_height,

---- Licence Attributes
licence.licenceid as licenceid,
-- trim(licence.clientid) as clientid,
trim(clientname.name) as clientname,
trim(licence.licencetype) as licencetype,
-- trim(licence.licencecode) as licencecode,
-- trim(licence.licencecategory) as licencecategory,

-- Spectrum Attributes
-- trim(spectrum.spectrumstatus) as spectrumstatus,
-- trim(spectrum.spectrumlabel) as spectrumlabel,
-- trim(spectrum.spectrumtype) as spectrumtype,
spectrum.frequency as frequency,
-- spectrum.spectrumlow as spectrumhigh,
-- spectrum.spectrumhigh as spectrumhigh,
spectrum.power as power,
-- trim(spectrum.polarisation) as polarisation,

-- Transmit Attributes
trim(txlocation.locationname) as tx_name,
txgeoref.easting as tx_lng,
txgeoref.northing as tx_lat,
-- txlocation.locationheight as tx_alt,
-- trim(transmitconfiguration.txantennamake) as txantennamake,
-- trim(transmitconfiguration.txantennatype) as txantennatype,
-- transmitconfiguration.txantennaheight as txantennaheight,
-- transmitconfiguration.txazimuth as txazimuth,
-- trim(transmitconfiguration.txequipment) as txequipment,

-- Receive Attributes
trim(rxlocation.locationname) as rx_name,
rxgeoref.easting as rx_lng,
rxgeoref.northing as rx_lat
-- rxlocation.locationheight as rx_alt,
-- trim(receiveconfiguration.rxantennamake) as rxantennamake,
-- trim(receiveconfiguration.rxantennatype) as rxantennatype,
-- receiveconfiguration.rxantennaheight as rxantennaheight,
-- receiveconfiguration.rxazimuth as rxazimuth,
-- trim(receiveconfiguration.rxequipment) as rxequipment

from receiveconfiguration 

JOIN transmitconfiguration using (licenceid) 
JOIN location as rxlocation on rxlocation.locationid = receiveconfiguration.locationid 
JOIN location as txlocation on txlocation.locationid = transmitconfiguration.locationid
JOIN geographicreference as rxgeoref on rxlocation.locationid = rxgeoref.locationid
JOIN geographicreference as txgeoref on txlocation.locationid = txgeoref.locationid
JOIN licence on receiveconfiguration.licenceid = licence.licenceid
JOIN clientname on licence.clientid = clientname.clientid
JOIN spectrum on spectrum.licenceid = licence.licenceid

-- Each location has heaps of different geographic reference schema, like old
-- surveying methods. We're only interested in WGS84, because that's the
-- standard, and what Google Maps uses.
-- georeferencetypeid = 3 is "WGS84"
where rxgeoref.georeferencetypeid = 3
and txgeoref.georeferencetypeid = 3

-- Point-to-point links are identified with a licence.licencecode starting with "F"
-- The "F" is for "Fixed". TV/Radio links start with "R" and "S"
-- For more licence codes, SQL: `select distinct licencecode, licencetype from licence;`
and licence.licencecode LIKE "F%"

-- Geosynchronous satellites are included in the feed.
-- When plotted on a map, these are massive lines going from NZ to the equator.
-- They're interesting, but since the lines are so big and all in one direction,
-- they look like a comb going across the country, and obscure the terrestrial
-- links so I've removed them here by removing points on the equator.
and txgeoref.northing != 0
and rxgeoref.northing != 0
;
