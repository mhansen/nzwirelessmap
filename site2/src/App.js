/* global google */
import React, { Component } from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import RaisedButton from 'material-ui/RaisedButton'
import AppBar from 'material-ui/AppBar'
import Drawer from 'material-ui/Drawer'
import TextField from 'material-ui/TextField'

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
      open: false,
      q: ''
    };
  }

  query = () => {
    return `clientname CONTAINS IGNORING CASE '${this.state.q}'`;
  }

  toggleDrawer = () => {
    this.setState({
      open: !this.state.open
    });
  }

  chorus = () => {
    this.setState({q: 'chorus'});
  }

  tvnz = () => {
    this.setState({q: 'mediaworks'});
  }

  textFieldChange = (e, newValue) => {
    this.setState({q: newValue});
  }

  drawerChanged = (open) => {
    this.setState({open: open});
  }

  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <AppBar
            style={{position: 'absolute'}}
            title="NZ Wireless Map"
            onLeftIconButtonTouchTap={this.toggleDrawer}
            iconElementRight={
              <TextField placeholder="Search Licensee" value={this.state.q} onChange={this.textFieldChange}/>}>
          </AppBar>
          <SimpleExampleGoogleMap
           containerElement={<div style={{ height: `100%` }} />}
            mapElement={ <div style={{ height: `100%` }} /> }
            q={this.query()}
            />
          <Drawer open={this.state.open} onRequestChange={this.drawerChanged} docked={false}>
            <RaisedButton label="Chorus" onTouchTap={this.chorus}/>
            <RaisedButton label="TVNZ" onTouchTap={this.tvnz}/>
          </Drawer>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
