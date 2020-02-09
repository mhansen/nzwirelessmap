import React from 'react';

export default class DrawerContent extends React.Component {
  render() {
    return (<div>
      <p>Each line is a point-to-point wireless radio link registered with 
      the NZ Government <a href="https://www.rsm.govt.nz/">Radio Spectrum Management</a> team.
      </p>
      <p>Click lines to see details about the radio link.</p>
      <p>
      Thanks to <a href="https://www.rsm.govt.nz/engineers-and-examiners/resources-for-engineers-and-certifiers/spectrum-search-lite/">Radio
        Spectrum Management</a> who make the database available.
        The data is <a href="https://www.rsm.govt.nz/copyright/">Crown Copyright</a>.
      </p>
      <p>
        This site was made by <a href="//markhansen.co.nz/">Mark Hansen</a>.
        The code's on <a href="https://github.com/mhansen/nzwirelessmap">GitHub</a>.
      </p>
      <p>
        <a href="http://markhansen.co.nz/nz-wireless-map">How this was made</a>.
      </p>
      <p>If you have any feedback, <a href="mailto:mark@markhansen.co.nz">email Mark</a>.</p>
      <p>You may also enjoy <a href="https://broadbandmap.nz/">National Broadband Map</a>.</p>
    </div>)
  }
}
