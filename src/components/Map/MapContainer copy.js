import React, { useState, useEffect, useRef } from "react";
import StaticMap from "react-map-gl";
import DeckGL from "@deck.gl/react";
import {
  ScatterplotLayer,
  PathLayer,
  IconLayer,
  TripsLayer,
  HexagonLayer,
  ScreenGridLayer,
  HeatmapLayer,
  COORDINATE_SYSTEM,
} from "deck.gl";
import { MapView } from "@deck.gl/core";

import { DataFilterExtension } from "@deck.gl/extensions";
import RangeInput from "./RangeInput";

// import CustomTripsLayer from "./map-layers/TripsLayer";

import data_points from "data/data_points.json";
import data_paths from "data/data_paths.json";
import data_trips from "data/data_trips.json";
// import data_icon from "data/data_icon.json";
import data_vessels from "data/data_vessels.json";

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
  const [timeRange, setTimeRange] = useState(_getTimeRange(data_vessels));
  const [filterValue, setFilterValue] = useState(timeRange);

  const MS_PER_DAY = 8.64e7;
  const dataFilter = new DataFilterExtension({
    filterSize: 1,
    fp64: false,
  });

  function _getTimeRange(data) {
    if (!data) {
      return null;
    }
    return data.reduce(
      (range, d) => {
        const t = d.time_stamp_int;
        range[0] = Math.min(range[0], t);
        range[1] = Math.max(range[1], t);
        return range;
      },
      [Infinity, -Infinity]
    );
  }

  function _formatLabel(t) {
    const date = new Date(t);
    return `${date.getUTCFullYear()}/${
      date.getUTCMonth() + 1
    }/${date.getUTCDay()} ${date.getUTCHours()}:${date.getUTCMinutes()}`;
  }

  useEffect(() => {
    const timeRange = _getTimeRange(filterValue);
    setTimeRange(timeRange);
    setFilterValue(timeRange);
  }, [filterValue]);

  const [tooltipInfo, setTooltipInfo] = useState({
    hoveredObject: "",
    pointerX: 0.0,
    pointerY: 0.0,
    coordinate: [0.0, 0.0],
  });

  const [time, setTime] = useState(0);
  const requestRef = useRef();
  const animate = () => {
    const loopLength = 1200; // unit corresponds to the timestamp in source data
    const animationSpeed = 240; // unit time per second
    const timestamp = Date.now() / 1000;
    const loopTime = loopLength / animationSpeed;

    setTime(((timestamp % loopTime) / loopTime) * loopLength);
    // The 'state' will always be the initial value here
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  });

  const layers = [
    new HeatmapLayer({
      id: "heatmapLayer",
      visible: false,
      data: data_points,
      getPosition: (d) => [d.longitude, d.latitude],
      intensity: 1.5,
      threshold: 0.2,
    }),
    new ScreenGridLayer({
      id: "screen-grid-layer",
      visible: false,
      data: data_points,
      pickable: false,
      opacity: 0.25,
      cellSizePixels: 50,
      getPosition: (d) => [d.longitude, d.latitude],
    }),
    new HexagonLayer({
      id: "hexagon-layer",
      data: data_points,
      lowerPercentile: 80,
      extruded: false,
      radius: 1500,
      opacity: 0.45,
      coverage: 0.98,
      getPosition: (d) => [d.longitude, d.latitude],
      visible: false,
    }),
    new PathLayer({
      id: "path",
      data: data_paths,
      getColor: [150, 255, 190],
      getWidth: 7,
      widthMinPixels: 5,
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
    new ScatterplotLayer({
      id: "scatter-plot",
      visible: false,
      data: data_points,
      coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
      getPosition: (d) => [d.longitude, d.latitude, 0],
      getFillColor: [101, 147, 245],
      getRadius: 100,
      radiusMinPixels: 3,
      pickable: true,
      onHover: (info) =>
        setTooltipInfo({
          hoveredObject: info.object,
          pointerX: info.x,
          pointerY: info.y,
          coordinate: info.coordinate,
        }),
    }),
    new IconLayer({
      id: "icon-layer",
      data: data_vessels,
      coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
      iconAtlas: require("img/arrow.png"),
      iconMapping: {
        marker: { x: 0, y: 0, width: 512, height: 512, mask: false },
      },
      getIcon: (d) => "marker",
      getPosition: (d) => [d.lon, d.lat, 0],
      getSize: (d) => 12,
      sizeScale: 2,
      sizeMinPixels: 3,
      sizeMaxPixels: 150,
      getColor: (d) => [140, 140, 0],
      getAngle: (d) => d.heading,
      pickable: true,
      onHover: (info) =>
        setTooltipInfo({
          hoveredObject: info.object,
          pointerX: info.x,
          pointerY: info.y,
          coordinate: info.coordinate,
        }),
      getFilterValue: (d) => d.time_stamp_int,
      filterRange: [filterValue[0], filterValue[1]],
      filterSoftRange: [
        filterValue[0] * 0.9 + filterValue[1] * 0.1,
        filterValue[0] * 0.1 + filterValue[1] * 0.9,
      ],
      extensions: [dataFilter],
    }),
    new TripsLayer({
      id: "trips",
      visible: false,
      data: data_trips,
      coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
      getPath: (d) => d.path,
      getTimestamps: (d) => d.timestamps,
      getColor: [255, 190, 210],
      opacity: 1,
      widthMinPixels: 5,
      rounded: true,
      trailLength: 120,
      currentTime: time,
      shadowEnabled: false,
    }),
  ];

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
          }}
        >
          <div>ID: {hoveredObject.id} </div>
          <div>X: {pointerX}</div>
          <div>Y: {pointerY}</div>
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

      {timeRange && (
        <RangeInput
          min={timeRange[0]}
          max={timeRange[1]}
          value={filterValue}
          animationSpeed={MS_PER_DAY * 30}
          formatLabel={_formatLabel}
          onChange={({ value }) => setFilterValue({ filterValue: value })}
        />
      )}
    </div>
  );
};

export default MapContainer;
