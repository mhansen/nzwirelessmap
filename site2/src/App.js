/* global google */
import React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AppBar from 'material-ui/AppBar'
import Dialog from 'material-ui/Dialog'
import AutoComplete from 'material-ui/AutoComplete'
import MenuItem from 'material-ui/MenuItem'

import {withGoogleMap, GoogleMap, FusionTablesLayer} from 'react-google-maps';
import 'whatwg-fetch'

import About from './About'
import './App.css';

const SimpleExampleGoogleMap = withGoogleMap(props => (
  <GoogleMap
      defaultZoom={6}
    defaultCenter={{ lat: -41, lng: 174 }}
    mapTypeId={google.maps.MapTypeId.SATELLITE}>
    <FusionTablesLayer
      options={{
        query: {
          select: "kml",
          from: "1355581",
          where: props.q
        },
      }}
    />
  </GoogleMap>
));

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      aboutOpen: false,
      q: '',
      dataSource: []
    };
  }

  componentDidMount() {
    const sql =
      'SELECT COUNT(), clientname ' +
      'FROM 1fAeKubYzWae7KT2qYFzku1M6N3c1Gncs1XDgPOc ' +
      'GROUP BY clientname ' +
      'ORDER BY COUNT() DESC';
    const key = 'AIzaSyBMxhigfinK9Rm5U8KspXKgZXifY1zVaUM';
    fetch(`https://www.googleapis.com/fusiontables/v2/query?sql=${sql}&key=${key}`).then((response) => {
      return response.json();
    }).then((json) => {
      this.setState({
        dataSource: json.rows.map((r) => {
          const t = r[1].toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
          return {
            text: t,
            value: <MenuItem primaryText={`${t} (${r[0]})`} />
          }
        })
      })
    }).catch((ex) => {
      console.error('fetching failed', ex);
    });
  }

  query = () => {
    return `clientname CONTAINS IGNORING CASE '${this.state.q}'`;
  }

  toggleAbout = () => {
    this.setState({
      aboutOpen: !this.state.aboutOpen
    });
  }

  textFieldChange = (newValue) => {
    this.setState({q: newValue});
  }

  dialogClosed = () => {
    this.setState({aboutOpen: false});
  }

  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <AppBar
            style={{position: 'absolute'}}
            title="NZ Wireless Map"
            onLeftIconButtonTouchTap={this.toggleAbout}
            iconElementRight={
              <AutoComplete
                name="search"
                dataSource={this.state.dataSource}
                hintText="Search Licensee"
                searchText={this.state.q}
                openOnFocus={true}
                filter={AutoComplete.caseInsensitiveFilter}
                maxSearchResults={10}
                onUpdateInput={this.textFieldChange} />}>
          </AppBar>
          <SimpleExampleGoogleMap
           containerElement={<div style={{ height: `100%` }} />}
            mapElement={ <div style={{ height: `100%` }} /> }
            q={this.query()}/>
          <Dialog open={this.state.aboutOpen} onRequestClose={this.dialogClosed}>
            <About/>
          </Dialog>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
