import React, {Component} from 'react';
import StaticMap from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import {ScatterplotLayer, PathLayer } from '@deck.gl/layers';
import {TripsLayer} from '@deck.gl/geo-layers';

import data_points from '../data/data_points.json';
import data_paths from '../data/data_paths.json';
import data_trips from "../data/data_trips.json";

// Set your mapbox access token here
const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const INITIAL_VIEW_STATE = {
  longitude: 103.8198,
  latitude: 1.2521,
  zoom: 10,
  pitch: 0,
  bearing: 0
};

class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 0
    };
  }

  componentDidMount() {
    this._animate();
  }

  componentWillUnmount() {
    if (this._animationFrame) {
      window.cancelAnimationFrame(this._animationFrame);
    }
  }

  _animate() {
    const {
      loopLength = 1200, // unit corresponds to the timestamp in source data
      animationSpeed = 240 // unit time per second
    } = this.props;
    const timestamp = Date.now() / 1000;
    const loopTime = loopLength / animationSpeed;

    this.setState({
      time: ((timestamp % loopTime) / loopTime) * loopLength
    });
    this._animationFrame = window.requestAnimationFrame(this._animate.bind(this));
  }

  _renderLayers() {
    // const {
     
    // } = this.props;

    return [
      new PathLayer ({
        id: 'path',
        data: data_paths,
        getColor: [150, 255, 190],
        getWidth: 7,
        widthMinPixels: 2
      }),
      new ScatterplotLayer({
        id: 'scatter-plot',
        data: data_points,
        radiusScale: 5,
        radiusMinPixels: 1,
        getPosition: d => [d.longitude, d.latitude, d.altitude*100],
        getColor: [101, 147, 245],
        getRadius: 35
      }),
      new TripsLayer({
        id: 'trips',
        data: data_trips,
        getPath: d => d.path,
        getTimestamps: d => d.timestamps,
        getColor: [255, 190, 210],
        opacity: 1,
        widthMinPixels: 5,
        rounded: true,
        trailLength: 120,
        currentTime: this.state.time,
        shadowEnabled: false
      }),
    ];
  }

  render() {
    const {
      mapStyle = 'mapbox://styles/mapbox/light-v10',
    } = this.props;
    
    return (

      <DeckGL
        layers={this._renderLayers()}
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
      >
        <StaticMap
          reuseMaps
          mapStyle={mapStyle}
          preventStyleDiffing={true}
          mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
        >
        </StaticMap>
      </DeckGL>
    );
  }
}

export default MapContainer;