import React, { Component } from 'react'
import {AmbientLight, PointLight, LightingEffect} from '@deck.gl/core';
import DeckGL from '@deck.gl/react';
import {TripsLayer as DeckGLTripsLayer} from '@deck.gl/geo-layers';


const DEFAULT_THEME = {
  trailColor0: [253, 128, 93],
  trailColor1: [23, 184, 190],
};

export default class TripLayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 0
    };
  }

  componentDidMount() {
    this.animate();
  }

  componentWillUnmount() {
    if (this._animationFrame) {
      window.cancelAnimationFrame(this._animationFrame);
    }
  }

  animate() {
    const {
      loopLength = 1800, // unit corresponds to the timestamp in source data
      animationSpeed = 180 // unit time per second
    } = this.props;
    const timestamp = Date.now() / 1000;
    const loopTime = loopLength / animationSpeed;

    this.setState({
      time: ((timestamp % loopTime) / loopTime) * loopLength
    });
    this._animationFrame = window.requestAnimationFrame(this.animate.bind(this));
  }

  renderLayer() {
    const {
      trips = data_trips,
      trailLength = 30,
      theme = DEFAULT_THEME
    } = this.props;

    return new DeckGLTripsLayer({
        id: 'trips',
        data: trips,
        getPath: d => d.path,
        getTimestamps: d => d.timestamps,
        getColor: d => (d.vendor === 0 ? theme.trailColor0 : theme.trailColor1),
        opacity: 0.3,
        widthMinPixels: 5,
        rounded: true,
        trailLength,
        currentTime: this.state.time,
        shadowEnabled: false
      })
    ;
  }
}