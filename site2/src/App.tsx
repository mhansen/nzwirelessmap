/* global google */
import React from 'react';
import {GoogleMapsOverlay} from '@deck.gl/google-maps';
import {LineLayer} from 'deck.gl';

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

// One row of JSON. Represents a point-to-point link.
interface Link {
  licenceid: string;
  clientname: string;
  licencetype: string;
  frequency: string;
  power: string;
  tx_name: string;
  tx_lng: string;
  tx_lat: string;
  rx_name: string;
  rx_lng: string;
  rx_lat: string;
}

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

const capitalize = (s : string) => s.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());

interface IProps {}

interface IState {
  aboutOpen: boolean;
  q: string;
  dataSource: any[];
  searchOpen: boolean;
  link: Link|null;
  p2plinks: Link[];
  overlay: GoogleMapsOverlay|null;
  lastModifiedTime: Date|null;
}

export default class App extends React.Component<IProps, IState> {
  constructor(props : IProps) {
    super(props);

    this.state = {
      aboutOpen: false,
      q: '',
      dataSource: [],
      searchOpen: false,
      link: null,
      p2plinks: [],
      overlay: null,
      lastModifiedTime: null,
    };
  }

  componentDidMount() {
    const p1 = loadScript(GOOGLE_MAPS_API_URL).then(() => {
      const mapContainer = document.getElementById('map')!;
      const map = new google.maps.Map(mapContainer, {
        center: {lat: -41, lng: 174},
        zoom: 6,
        mapTypeId: 'satellite',
      });
      const overlay = new GoogleMapsOverlay({
        layers: [new LineLayer({id: 'point2point', data: []})]
      });
      overlay.setMap(map);
      this.setState({
        overlay: overlay
      });
    });
    const p2 = fetch("https://nz-wireless-map.storage.googleapis.com/prism.json/latest", {
    }).then(res => {
      this.setLastModifiedTime(new Date(res.headers.get('Last-Modified')!));
      return res.json()
    });

    Promise.all([p1, p2]).then(values => {
      const [_, p2plinks] = values;
      this.setLinks(p2plinks);
    });
  }

  createLineLayer(p2plinks : Iterable<Link>) {
    return new LineLayer({
      id: 'point2point',
      data: p2plinks,
      getSourcePosition: (d: Link) => [parseFloat(d.rx_lng), parseFloat(d.rx_lat)],
      getTargetPosition: (d: Link) => [parseFloat(d.tx_lng), parseFloat(d.tx_lat)],
      getWidth: 100, // balance between being able to see auckland and not
      widthUnits: 'meters',
      widthMinPixels: 1.5, // i get aliasing with 1, but 2 seems too big.
      widthMaxPixels: 100, // big enough to click
      getColor: [120, 249, 0],
      pickable: true,
      onClick: info => this.onRadioLinkClick(info.object as Link),
      autoHighlight: true,
    });
  }


  setLastModifiedTime(date: Date) {
    this.setState({
      lastModifiedTime: date
    });
  }

  setLinks(p2plinks: Link[]) {
    const indexedClientNames = count(p2plinks.map((link: Link) => link.clientname));
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

    this.setState({
      dataSource: dataSource,
      p2plinks: p2plinks,
    });
    this.updateLayers();
  }

  onRadioLinkClick(link : Link) {
    this.setState({
      link: link
    });
  }

  toggleAbout() {
    this.setState({
      aboutOpen: !this.state.aboutOpen
    });
  }

  textFieldChange(newValue: string) {
    this.setState({q: newValue}, () => this.updateLayers());
  }

  updateLayers() {
    if (!this.state.overlay) {
      return;
    }
    if (!this.state.q) {
      this.state.overlay.setProps({
        layers: [this.createLineLayer(this.state.p2plinks)],
      });
      return;
    }
    this.state.overlay.setProps({
      layers: [this.createLineLayer(this.state.p2plinks.filter(link => link.clientname.toLowerCase() === this.state.q.toLowerCase()))],
    });
  }

  dialogClosed() {
    this.setState({aboutOpen: false});
  }

  toggleSearch() {
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
            onLeftIconButtonClick={() => this.toggleAbout()}
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
                    onUpdateInput={(newValue) => this.textFieldChange(newValue)}
                    onNewRequest={(chosenRequest) => this.textFieldChange(chosenRequest.clientname)}
                  />
                :
                <IconButton tooltip="Search" onClick={() => this.toggleSearch()}>
                  <FontIcon className="material-icons">search</FontIcon>
                </IconButton> 
              }
              </div>
              }>
          </AppBar>
          <div id="map"></div>
          <Dialog open={this.state.aboutOpen} onRequestClose={() => this.dialogClosed()}>
            <About lastModifiedTime={this.state.lastModifiedTime}/>
          </Dialog>
          <Dialog open={this.state.link != null} onRequestClose={() => {this.setState({link: null});}}>
            <dl>
              <dt>License ID:</dt>
              <dd>
                <a href={'https://rrf.rsm.govt.nz/rrf/licence/id/' + this.state.link?.licenceid}>
                  {this.state.link?.licenceid}
                </a>
              </dd>
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
          </Dialog>
        </div>
      </MuiThemeProvider>
    );
  }
}
