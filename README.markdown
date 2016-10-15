The goal: Visualise the wireless network links of New Zealand.

The data's available in the Radio Spectrum Management database, available from
http://www.rsm.govt.nz/ in MS Access format.

## Instructions

To download the MDB database from RSM, convert the MDB database
into a cross-platform SQLite database, and make a CSV file for
import into Fusion Tables, run

    $ rake point_to_point_links.csv

Then upload to fusion tables with

    $ rake update_fusion_tables[{refresh_token}]

where {refresh\_token} is a pre-generated token that grants access to your Fusion Tables.

You can browse the map generated at http://wirelessmap.markhansen.co.nz/.

## Licence
My source code is MIT licenced.

The data in the Radio Spectrum Database is Crown Copyright, sourced from [Radio
Spectrum Management][1] For copyright terms, see [RSM's copyright page][2].

[1]: http://www.rsm.govt.nz/cms/tools-and-services/spectrum-search-lite
[2]: http://www.rsm.govt.nz/cms/customer-support/about-this-site/copyright
