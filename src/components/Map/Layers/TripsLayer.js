import React, { useState, useEffect, useRef } from "react";
import { COORDINATE_SYSTEM } from "deck.gl";
import { CompositeLayer, TripsLayer } from "deck.gl";

class CustomTripsLayer extends CompositeLayer {
  constructor(props) {
    super(props);
    this.state = {
      time: 0,
    };
  }

  componentDidMount() {
    this._animate();
  }

  componentWillUnmount() {
    if (this._animationFrame) {
      cancelAnimationFrame(this._animationFrame);
    }
  }

  _animate() {
    const {
      loopLength = 1200, // unit corresponds to the timestamp in source data
      animationSpeed = 240, // unit time per second
    } = this.props;
    const timestamp = Date.now() / 1000;
    const loopTime = loopLength / animationSpeed;

    this.setState({
      time: ((timestamp % loopTime) / loopTime) * loopLength,
    });
    this._animationFrame = requestAnimationFrame(this._animate.bind(this));
  }
  renderLayers() {
    return [
      new TripsLayer({
        id: "trips",
        data: this.props.data,
        coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
        getPath: (d) => d.path,
        getTimestamps: (d) => d.timestamps,
        getColor: [255, 190, 210],
        opacity: 1,
        widthMinPixels: 5,
        rounded: true,
        trailLength: 120,
        currentTime: this.state.time,
        shadowEnabled: false,
      }),
    ];
  }
}

// const CustomTripsLayer = ({ data }) => {
//   const [time, setTime] = useState(0);
//   const requestRef = useRef();
//   const animate = () => {
//     const loopLength = 1200; // unit corresponds to the timestamp in source data
//     const animationSpeed = 240; // unit time per second
//     const timestamp = Date.now() / 1000;
//     const loopTime = loopLength / animationSpeed;
//     setTime(((timestamp % loopTime) / loopTime) * loopLength);
//     requestRef.current = requestAnimationFrame(animate);
//   };

//   useEffect(() => {
//     requestRef.current = requestAnimationFrame(animate);
//     return () => cancelAnimationFrame(requestRef.current);
//   });

//   return <CustomLayer data={data} time={time} />;
// };

export default CustomTripsLayer;
