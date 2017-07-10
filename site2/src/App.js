/* global google */
import React, { Component } from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AppBar from 'material-ui/AppBar'
import TextField from 'material-ui/TextField'
import About from './About'
import Dialog from 'material-ui/Dialog'

import {withGoogleMap, GoogleMap, FusionTablesLayer} from 'react-google-maps';

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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aboutOpen: false,
      q: ''
    };
  }

  query = () => {
    return `clientname CONTAINS IGNORING CASE '${this.state.q}'`;
  }

  toggleAbout = () => {
    this.setState({
      aboutOpen: !this.state.aboutOpen
    });
  }

  textFieldChange = (e, newValue) => {
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
              <TextField
                name="search"
                placeholder="Search Licensee"
                value={this.state.q}
                onChange={this.textFieldChange} />}>
          </AppBar>
          <SimpleExampleGoogleMap
           containerElement={<div style={{ height: `100%` }} />}
            mapElement={ <div style={{ height: `100%` }} /> }
            q={this.query()}/>
          <Dialog open={this.state.aboutOpen} onRequestClose={this.dialogClosed} docked={false}>
            <About/>
          </Dialog>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
