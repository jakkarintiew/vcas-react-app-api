import React, { useState, useEffect } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import StaticMap from "react-map-gl";
import DeckGL from "@deck.gl/react";
import { IconLayer, PathLayer, GeoJsonLayer, COORDINATE_SYSTEM } from "deck.gl";
import { MapView } from "@deck.gl/core";
import { DataFilterExtension } from "@deck.gl/extensions";

import RangeInput from "./RangeInput";

// Set your mapbox access token here
const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
const MAP_VIEW = new MapView({
  // 1 is the distance between the camera and the ground
  farZMultiplier: 100,
});
const INITIAL_VIEW_STATE = {
  longitude: 103.8198,
  latitude: 1.2521,
  zoom: 10,
  pitch: 0,
  bearing: 0,
};

const MapContainer = (props) => {
  const [tooltipInfo, setTooltipInfo] = useState({
    hoveredObject: "",
    pointerX: 0.0,
    pointerY: 0.0,
    coordinate: [0.0, 0.0],
  });

  const renderTooltip = () => {
    const { hoveredObject, pointerX, pointerY, coordinate } = tooltipInfo;
    return (
      hoveredObject && (
        <div
          style={{
            position: "absolute",
            zIndex: 1,
            pointerEvents: "none",
            left: pointerX,
            top: pointerY,
            backgroundColor: "lightgrey",
            padding: "10px",
            borderRadius: " 5px",
          }}
        >
          <div>MMSI: {hoveredObject.mmsi} </div>
          <div>Ship Name: {hoveredObject.shipname} </div>
          <div>Ship Type: {hoveredObject.shiptype} </div>
          <div>Speed: {hoveredObject.speed} </div>
          <div>Course: {hoveredObject.course} </div>
          <div>Heading: {hoveredObject.heading} </div>
          <div>Risk: {hoveredObject.risk} </div>
          {/* <div>X: {pointerX}</div>
          <div>Y: {pointerY}</div> */}
          <div>
            Longitude:{" "}
            {Math.round((coordinate[0] + Number.EPSILON) * 100) / 100}
          </div>
          <div>
            Latitude: {Math.round((coordinate[1] + Number.EPSILON) * 100) / 100}
          </div>
        </div>
      )
    );
  };

  const layers = [
    new GeoJsonLayer({
      id: "geojson-layer",
      data: props.data,
      pickable: true,
      stroked: false,
      filled: true,
      extruded: true,
      lineWidthScale: 20,
      lineWidthMinPixels: 2,
      getFillColor: [160, 160, 180, 200],
      getLineColor: (d) => [78, 183, 217],
      getRadius: 100,
      getLineWidth: 1,
      getElevation: 30,
    }),
    // new PathLayer({
    //   id: "historical-path-layer",
    //   data: props.data,
    //   getPath: (d) => d.historical_path,
    //   getColor: [78, 183, 217],
    //   opacity: 0.4,
    //   getWidth: 3,
    //   rounded: true,
    //   widthMinPixels: 3,
    //   coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
    //   pickable: true,
    //   onHover: (info) =>
    //     setTooltipInfo({
    //       hoveredObject: info.object,
    //       pointerX: info.x,
    //       pointerY: info.y,
    //       coordinate: info.coordinate,
    //     }),
    // }),
    // new PathLayer({
    //   id: "future-path-layer",
    //   data: props.data,
    //   getPath: (d) => d.future_path,
    //   getColor: (d) => [255, 203, 79],
    //   getWidth: (d) => 3,
    //   opacity: 0.4,
    //   rounded: true,
    //   widthMinPixels: 3,
    //   coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
    //   pickable: true,
    //   onHover: (info) =>
    //     setTooltipInfo({
    //       hoveredObject: info.object,
    //       pointerX: info.x,
    //       pointerY: info.y,
    //       coordinate: info.coordinate,
    //     }),
    // }),
    // new IconLayer({
    //   id: "icon-layer",
    //   data: props.data.,
    //   coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
    //   iconAtlas: require("img/arrow_small.png"),
    //   iconMapping: {
    //     marker: { x: 0, y: 0, width: 64, height: 64, mask: false },
    //   },
    //   getIcon: (d) => "marker",
    //   getPosition: (d) => [d.longitude, d.latitude, 0],
    //   getSize: (d) => 12,
    //   sizeScale: 2,
    //   sizeMinPixels: 3,
    //   sizeMaxPixels: 150,
    //   getAngle: (d) => 360 - d.heading,
    //   pickable: true,
    //   onHover: (info) =>
    //     setTooltipInfo({
    //       hoveredObject: info.object,
    //       pointerX: info.x,
    //       pointerY: info.y,
    //       coordinate: info.coordinate,
    //     }),
    // }),
  ];

  return (
    <div>
      <DeckGL
        views={MAP_VIEW}
        layers={layers}
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
      >
        <StaticMap
          reuseMaps
          mapStyle={props.mapStyle}
          preventStyleDiffing={true}
          mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
        ></StaticMap>
        {renderTooltip()}
      </DeckGL>
    </div>
  );
};

export default MapContainer;
