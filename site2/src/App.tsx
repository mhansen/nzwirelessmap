/* global google */
import React from 'react';
import {GoogleMapsOverlay} from '@deck.gl/google-maps';
import {LineLayer} from 'deck.gl';
import p2plinks from './point_to_point_links.json';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AppBar from 'material-ui/AppBar'
import Dialog from 'material-ui/Dialog'
import AutoComplete from 'material-ui/AutoComplete'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import FontIcon from 'material-ui/FontIcon'

import About from './About'
import './App.css';

const GOOGLE_MAPS_API_KEY = 'AIzaSyBNy69MtC5GTrt3DiRUUOZLUAFhpWx-FIQ';
const GOOGLE_MAPS_API_URL = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=visualization`;

function loadScript(url: string) {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  const head = document.querySelector('head');
  head!.appendChild(script);
  return new Promise(resolve => {
    script.onload = resolve;
  });
}

function createLineLayer(data : object[]) {
  return new LineLayer({
    id: 'point2point',
    data: data,
    getSourcePosition: d => [d.rx_lng, d.rx_lat],
    getTargetPosition: d => [d.tx_lng, d.tx_lat],
    getWidth: 100, // balance between being able to see auckland and not
    widthUnits: 'meters',
    widthMinPixels: 1.5, // i get aliasing with 1, but 2 seems too big.
    widthMaxPixels: 100, // big enough to click
    getColor: [120, 249, 0],
    pickable: true,
    onClick: info => app.onRadioLinkClick(info.object),
    autoHighlight: true,
  });
}

var overlay : GoogleMapsOverlay; // Bit of a hack

loadScript(GOOGLE_MAPS_API_URL).then(() => {
  const mapContainer = document.getElementById('map')!;
  const map = new google.maps.Map(mapContainer, {
    center: {lat: -41, lng: 174},
    zoom: 6,
    mapTypeId: 'satellite',
  });
  overlay = new GoogleMapsOverlay({
    layers: [createLineLayer(p2plinks)]
  });
  overlay.setMap(map);
});

const count = (clientnames: string[]) => {
  var out = new Map<string, number>();
  for (let clientname of clientnames) {
    if (!out.has(clientname)) {
      out.set(clientname, 0);
    }
    out.set(clientname, out.get(clientname)! + 1);
  }
  return out;
}

const indexedClientNames = count(p2plinks.map(link => link.clientname));
console.log(indexedClientNames);

const capitalize = (s : string) => s.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());

interface IProps {

}

interface IState {
  aboutOpen: boolean;
  q: string;
  dataSource: any[];
  searchOpen: boolean;
  link: object|null;
}

export default class App extends React.Component<IProps, IState> {
  constructor(props : IProps) {
    super(props);

    const dataSource = [];
    for (let [clientname, count] of indexedClientNames.entries()) {
      const capitalized = capitalize(clientname);
      const withCount = capitalized + ` (${count})`;

      dataSource.push({
          text: capitalized,
          value: <MenuItem primaryText={withCount} />,
          clientname: clientname,
          count: count,
        }
      );
    }
    // Sort desc
    dataSource.sort((a, b) => b.count - a.count);

    this.state = {
      aboutOpen: false,
      q: '',
      dataSource: dataSource,
      searchOpen: false,
      link: null,
    };
  }

  onRadioLinkClick = (link : object) => {
    this.setState({
      link: link
    });
  }

  toggleAbout = () => {
    this.setState({
      aboutOpen: !this.state.aboutOpen
    });
  }

  textFieldChange = (newValue: string) => {
    this.setState({q: newValue});
    // HACK, just return early if there's no maps, oh well.
    // A shame about the race conditions loading maps. Maybe I should load Maps synchronously?
    if (!overlay) {
      return;
    }
    if (!newValue) {
      overlay.setProps({
        layers: [createLineLayer(p2plinks)],
      });
      return;
    }
    overlay.setProps({
      layers: [createLineLayer(p2plinks.filter(link => link.clientname.toLowerCase() === newValue.toLowerCase()))],
    });
  }

  dialogClosed = () => {
    this.setState({aboutOpen: false});
  }

  toggleSearch = () => {
    this.setState({
      searchOpen: !this.state.searchOpen
    });
  }

  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <AppBar
            style={{position: 'absolute'}}
            title="NZ Wireless Map"
            onLeftIconButtonClick={this.toggleAbout}
            iconElementRight={
              <div>
              { 
                this.state.searchOpen
                ?
                  <AutoComplete
                    name="search"
                    dataSource={this.state.dataSource}
                    hintText="Search Licensee"
                    searchText={this.state.q}
                    openOnFocus={true}
                    filter={AutoComplete.caseInsensitiveFilter}
                    maxSearchResults={10}
                    onUpdateInput={this.textFieldChange}
                  />
                :
                <IconButton tooltip="Search" onClick={this.toggleSearch}>
                  <FontIcon className="material-icons">search</FontIcon>
                </IconButton> 
              }
              </div>
              }>
          </AppBar>
          <div id="map"></div>
          <Dialog open={this.state.aboutOpen} onRequestClose={this.dialogClosed}>
            <About/>
          </Dialog>
          <Dialog open={this.state.link != null} onRequestClose={() => {this.setState({link: null});}}>
            <dl>
              <dt>License ID:</dt>
              <dd>{this.state.link?.licenceid}</dd>
              <dt>Client name:</dt>
              <dd>{this.state.link?.clientname}</dd>
              <dt>License type:</dt>
              <dd>{this.state.link?.licencetype}</dd>
              <dt>Frequency:</dt>
              <dd>{this.state.link?.frequency} MHz</dd>
              <dt>Transmitter name:</dt>
              <dd>{this.state.link?.tx_name}</dd>
              <dt>Receiver name:</dt>
              <dd>{this.state.link?.rx_name}</dd>
              <dt>Power:</dt>
              <dd>{this.state.link?.power} dBW (eirp)</dd>
            </dl>
            <p>
              <a href="https://rrf.rsm.govt.nz/smart-web/smart/page/-smart/domain/licence/SelectLicencePage.wdk">Search Radio Spectrum Management for more details</a>.
            </p>
          </Dialog>
        </div>
      </MuiThemeProvider>
    );
  }
}
