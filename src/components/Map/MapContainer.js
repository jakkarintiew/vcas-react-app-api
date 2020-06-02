import React, { useState, useEffect, useRef } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import StaticMap from "react-map-gl";
import DeckGL from "@deck.gl/react";
import {
  IconLayer,
  PathLayer,
  TripsLayer,
  ScreenGridLayer,
  HexagonLayer,
  COORDINATE_SYSTEM,
} from "deck.gl";
import { MapView } from "@deck.gl/core";

import { useSelector, useDispatch } from "react-redux";
import { setActiveVesselActionCreator } from "app/redux";

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
  const dispatch = useDispatch();
  const activeVesselID = useSelector((state) => state.activeVesselID);
  const setActiveVesselID = (activeVesselID) => {
    dispatch(setActiveVesselActionCreator(activeVesselID));
  };

  const [activeVessel, setActiveVessel] = useState(
    props.data.filter((data) => {
      return data.mmsi === activeVesselID;
    })
  );

  const clickVesselEvent = (activeVesselID) => {
    setActiveVesselID(activeVesselID);
    setActiveVessel(
      props.data.filter((data) => {
        return data.mmsi === activeVesselID;
      })
    );
  };

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

  const [time, setTime] = useState(1546272005);
  const requestRef = useRef();
  const animate = () => {
    const loopLength = 86400; // seconds in a day
    const animationSpeed = 86400 / 15; // unit time per second
    const timestamp = Date.now() / 1000;
    const loopTime = loopLength / animationSpeed;

    setTime(1546272005 + ((timestamp % loopTime) / loopTime) * loopLength);
    // The 'state' will always be the initial value here
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  });

  const movingVessels = props.data.filter((data) => {
    return data.speed > 1;
  });

  const riskyVessels = props.data.filter((data) => {
    return data.speed > 1 && data.risk > 30;
  });

  const layers = [
    new ScreenGridLayer({
      id: "screen-grid-layer",
      visible: false,
      data: riskyVessels,
      pickable: false,
      opacity: 0.25,
      cellSizePixels: 50,
      getPosition: (d) => [d.longitude, d.latitude],
    }),
    new HexagonLayer({
      id: "hexagon-layer",
      visible: true,
      data: riskyVessels,
      lowerPercentile: 0,
      extruded: false,
      radius: 3000,
      opacity: 0.45,
      coverage: 0.98,
      getPosition: (d) => [d.longitude, d.latitude],
    }),
    new PathLayer({
      id: "historical-path-layer",
      visible: true,
      data: activeVessel,
      getPath: (d) => d.historical_path,
      getColor: [100, 100, 120],
      opacity: 0.4,
      getWidth: 10,
      rounded: true,
      widthMinPixels: 8,
      coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
      pickable: true,
      onHover: (info) =>
        setTooltipInfo({
          hoveredObject: info.object,
          pointerX: info.x,
          pointerY: info.y,
          coordinate: info.coordinate,
        }),
    }),
    new PathLayer({
      id: "future-path-layer",
      visible: true,
      data: activeVessel,
      getPath: (d) => d.future_path,
      getColor: (d) => [80, 200, 192],
      getWidth: 10,
      opacity: 0.4,
      rounded: true,
      widthMinPixels: 8,
      coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
      pickable: true,
      onHover: (info) =>
        setTooltipInfo({
          hoveredObject: info.object,
          pointerX: info.x,
          pointerY: info.y,
          coordinate: info.coordinate,
        }),
    }),
    new TripsLayer({
      id: "trips-layer-historical-path",
      visible: true,
      data: activeVessel,
      coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
      getPath: (d) => d.historical_path,
      getTimestamps: (d) => d.historical_timestamps,
      getColor: [255, 120, 89],
      opacity: 0.8,
      widthMinPixels: 10,
      rounded: true,
      trailLength: 5000,
      currentTime: time,
      shadowEnabled: false,
    }),
    new TripsLayer({
      id: "trips-layer-future-path",
      visible: true,
      data: activeVessel,
      coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
      getPath: (d) => d.future_path,
      getTimestamps: (d) => d.future_timestamps,
      getColor: [80, 255, 120],
      opacity: 0.8,
      widthMinPixels: 10,
      rounded: true,
      trailLength: 5000,
      currentTime: time,
      shadowEnabled: false,
    }),
    new IconLayer({
      id: "icon-layer",
      data: movingVessels,
      coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
      iconAtlas: require("img/vessel_marker.png"),
      iconMapping: {
        marker: { x: 0, y: 0, width: 64, height: 64, mask: false },
      },
      getIcon: (d) => "marker",
      getPosition: (d) => [d.longitude, d.latitude, 0],
      getSize: (d) => 300,
      sizeUnits: "meters",
      sizeScale: 1,
      sizeMinPixels: 12,
      getAngle: (d) => 360 - d.heading,
      pickable: true,
      billboard: false,
      onHover: (info) =>
        setTooltipInfo({
          hoveredObject: info.object,
          pointerX: info.x,
          pointerY: info.y,
          coordinate: info.coordinate,
        }),
      onClick: (info) => clickVesselEvent(info.object.mmsi),
    }),
  ];

  return (
    <div>
      <DeckGL
        views={MAP_VIEW}
        layers={layers}
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        getCursor={() => "crosshair"}
      >
        <StaticMap
          reuseMaps
          mapStyle={props.mapStyle}
          preventStyleDiffing={true}
          mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
        ></StaticMap>
        {renderTooltip()}
      </DeckGL>
      {/* 
      {timeRange && (
        <RangeInput
          min={timeRange[0]}
          max={timeRange[1]}
          value={filterValue}
          animationSpeed={MS_PER_DAY / 1000}
          formatLabel={_formatLabel}
          onChange={({ value }) => setFilterValue(value)}
        />
      )} */}
    </div>
  );
};

export default MapContainer;
