import React from 'react';

interface IProps {
  lastModifiedTime: Date|null;
}

interface IState {}

export default class DrawerContent extends React.Component<IProps, IState> {
  render() {
    return (<div>
      <p>Data last updated {this.props.lastModifiedTime?.toLocaleString("en-NZ",
      {timeZone: "Pacific/Auckland"})} (NZ Time) from the <a
      href="https://www.rsm.govt.nz/engineers-and-examiners/resources-for-engineers-and-certifiers/spectrum-search-lite/">download
      page</a>.</p>
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
      <p>
        Please don't use this to burn down 5G towers. Our best evidence is that 5G is safe:
        <ul>
          <li>
            "As I scientist, I think it's healthy to be skeptical of current knowledge. but is there any reason to be worried about 5G? the simple answer is no- If there is if there is a harmful effect, I honestly think we’d know about it by now." -- <a href="https://docs.google.com/document/d/e/2PACX-1vR0Ik4UveZytN1tVQYmIY5NIGbCkUYfytmBDatPRvPzjGLFN6Nil5Wdl26TosUNz_L6TPfTeU5mxuqF/pub#ftnt_ref95">Chris Collins, a professor of radiology at NYU School of medicine, on "Science VS" podcast.</a>
          </li>
          <li>
            <a href="https://www.who.int/news-room/fact-sheets/detail/electromagnetic-fields-and-public-health-mobile-phones">
              World Health Organization:
            </a>{' '}
            "A large number of studies have been performed over the last two decades to assess whether mobile phones pose a potential health risk. To date, no adverse health effects have been established as being caused by mobile phone use."
          </li>
        </ul>
      </p>
    </div>)
  }
}
