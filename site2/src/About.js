import React from 'react';

export default class DrawerContent extends React.Component {
  render() {
    return (<div>
      <h2>About</h2>
      <p>Each line represents a point-to-point wireless radio link registered with 
      the NZ government <a href="https://www.rsm.govt.nz/">Radio Spectrum Management</a> unit.</p>
      <p>You can click on lines to get details about the radio link.</p>
      <p>
        This site was made by me, <a href="//markhansen.co.nz/">Mark Hansen</a>.
        The code's all available on <a href="https://github.com/mhansen/nzwirelessmap">Github</a>.
        I wrote <a href="http://markhansen.co.nz/nz-wireless-map">a blog post explaining how I made this</a>.
      </p>
      <p>
      Many thanks to <a
        href="http://www.rsm.govt.nz/cms/tools-and-services/spectrum-search-lite">Radio
        Spectrum Management</a> who make the database available to the
      public. The data is <a href="http://www.rsm.govt.nz/about-this-site/copyright-c/">Crown
        Copyright</a>, with permission to reproduce accurately in any format.</p>
      <p>If you have any feedback, criticism, or suggestions, I'd love to
      hear from you! <a href="mailto:mark@markhansen.co.nz">Email me</a></p>
      <p>If you'd like to do more powerful filtering, try <a href="https://fusiontables.google.com/DataSource?docid=1fAeKubYzWae7KT2qYFzku1M6N3c1Gncs1XDgPOc#rows:id=1">Google Fusion Tables on the raw data</a> behind this site.</p>
      <p>You may also enjoy <a href="https://broadbandmap.nz/">National Broadband Map</a>.</p>
    </div>)
  }
}
