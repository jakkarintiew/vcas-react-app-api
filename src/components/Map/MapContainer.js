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
  PolygonLayer,
  TextLayer,
  COORDINATE_SYSTEM,
  FlyToInterpolator,
} from "deck.gl";
import { View, MapView } from "@deck.gl/core";

import { useSelector, useDispatch } from "react-redux";
import {
  setViewStatesActionCreator,
  storeActiveVesselViewStatesActionCreator,
  setActiveVesselActionCreator,
} from "app/redux";

import MapTooltip from "./MapTooltip";

import data_anchorages from "data/seamark_anchorages.json";
import data_dredged_areas from "data/seamark_dredged_areas.json";
import vessel_type_lookup from "data/vessel_type_lookup.json";

const MapContainer = (props) => {
  // Set your mapbox access token here
  const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

  // Redux states
  const dispatch = useDispatch();

  const layerVisibility = useSelector((state) => state.layerVisibility);

  const activeVesselID = useSelector((state) => state.activeVesselID);
  const setActiveVesselID = (activeVesselID) => {
    dispatch(setActiveVesselActionCreator(activeVesselID));
  };

  const mapView = useSelector((state) => state.mapView);
  const setViewStates = (newViewState) => {
    dispatch(setViewStatesActionCreator(newViewState));
  };
  const storeActiveVesselViewStates = (vesselViewState) => {
    dispatch(storeActiveVesselViewStatesActionCreator(vesselViewState));
  };

  const vesselTypeFilters = useSelector((state) => state.vesselTypeFilters);

  const VIEWS = [
    new MapView({
      id: "main",
      controller: true,
    }),
    mapView.miniMapViewEnabled &&
      new MapView({
        id: "minimap",
        // Position on top of main map
        x: "17%",
        y: "65%",
        width: "300px",
        height: "300px",
        // Minimap is overlaid on top of an existing view, so need to clear the background
        clear: true,
        controller: {
          maxZoom: 10,
          minZoom: 10,
          scrollZoom: true,
          dragPan: true,
          dragRotate: false,
          doubleClickZoom: false,
          touchZoom: false,
          touchRotate: false,
          keyboard: false,
        },
      }),
  ].filter(Boolean);

  const _onViewStateChange = ({ viewState, viewId }) => {
    const newViewStates = { ...mapView.viewStates };
    // Update a single view
    newViewStates[viewId] = viewState;
    // Save the view state and trigger rerender
    setViewStates(newViewStates);
  };

  // Component states
  const [activeVessel, setActiveVessel] = useState(
    props.data.filter((data) => {
      return data.mmsi === activeVesselID;
    })
  );

  const _clickVesselEvent = (mmsi) => {
    setActiveVesselID(mmsi);
    const newActiveVessel = props.data.filter((data) => {
      return data.mmsi === mmsi;
    });

    const vesselViewState = {
      longitude: newActiveVessel[0].longitude,
      latitude: newActiveVessel[0].latitude,
      zoom: 14,
      pitch: 60,
      bearing: newActiveVessel[0].heading,
    };

    if (mapView.vesselViewEnabled) {
      setViewStates({
        main: vesselViewState,
        minimap: { ...vesselViewState, pitch: 0, bearing: 0 },
      });
    } else {
      setViewStates({
        main: { ...mapView.viewStates.main },
        minimap: { ...vesselViewState, zoom: 10, pitch: 0, bearing: 0 },
      });
    }
    storeActiveVesselViewStates({
      main: vesselViewState,
      minimap: { ...vesselViewState, zoom: 10, pitch: 0, bearing: 0 },
    });
    setActiveVessel(newActiveVessel);
  };

  const [tooltipInfo, setTooltipInfo] = useState({
    objectType: "",
    hoveredObject: "",
    pointerX: 0.0,
    pointerY: 0.0,
    coordinate: [0.0, 0.0],
  });

  const _renderTooltip = () => {
    const { hoveredObject } = tooltipInfo;
    return hoveredObject && <MapTooltip tooltipInfo={tooltipInfo} />;
  };

  const [time, setTime] = useState(1546272005);
  const requestRef = useRef();
  const animate = () => {
    const loopLength = 86400; // seconds in a day
    const animationSpeed = 86400 / 30; // unit time per second
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

  const riskyVessels = props.data.filter((data) => {
    return data.risk > 50;
  });

  const visibleVessels = props.data.filter((data) => {
    const visibleTypes = vesselTypeFilters.map((vessel) => {
      return vessel.filterState ? vessel.vesselType : null;
    });
    return visibleTypes.includes(vessel_type_lookup[data.shiptype]);
  });

  const layers = [
    layerVisibility.riskScreenGrid.visible &&
      new ScreenGridLayer({
        id: "risk-screen-grid-layer",
        data: riskyVessels,
        pickable: false,
        opacity: 0.25,
        cellSizePixels: 64,
        getPosition: (d) => [d.longitude, d.latitude],
      }),
    layerVisibility.riskHexagon.visible &&
      new HexagonLayer({
        id: "risk-hexagon-layer",
        data: riskyVessels,
        lowerPercentile: 0,
        extruded: false,
        radius: 1500,
        opacity: 0.25,
        coverage: 0.98,
        getPosition: (d) => [d.longitude, d.latitude],
      }),
    layerVisibility.mooringPolygon.visible &&
      new PolygonLayer({
        id: "dredged-polygon-layer",
        data: data_dredged_areas,
        stroked: true,
        filled: true,
        lineWidthMinPixels: 1,
        getPolygon: (d) => d.coordinates,
        getFillColor: [225, 225, 255, 100],
        getLineColor: [130, 130, 190],
        getLineWidth: 1,
        pickable: true,
        autoHighlight: true,
        highlightColor: [225, 225, 255, 220],
        onHover: (info) =>
          setTooltipInfo({
            objectType: "mooring",
            hoveredObject: info.object,
            pointerX: info.x,
            pointerY: info.y,
            coordinate: info.centroid,
          }),
      }),
    layerVisibility.anchorangePolygon.visible &&
      new PolygonLayer({
        id: "anchorages-polygon-layer",
        data: data_anchorages,
        stroked: true,
        filled: true,
        lineWidthMinPixels: 1,
        getPolygon: (d) => d.coordinates,
        getFillColor: [225, 255, 225, 100],
        getLineColor: [130, 190, 130],
        getLineWidth: 1,
        pickable: true,
        autoHighlight: true,
        highlightColor: [225, 255, 225, 220],
        onHover: (info) =>
          setTooltipInfo({
            objectType: "anchorage",
            hoveredObject: info.object,
            pointerX: info.x,
            pointerY: info.y,
            coordinate: info.centroid,
          }),
      }),
    layerVisibility.anchorangePolygon.visible &&
      new TextLayer({
        id: "anchorages-text-layer",
        data: data_anchorages,
        pickable: true,
        getPosition: (d) => d.centroid,
        getText: (d) => d.name,
        getColor: [110, 110, 110],
        sizeUnits: "meters",
        getSize: 150,
        getAngle: 0,
        wordBreak: "break-word",
        maxWidth: 600,
        getTextAnchor: "middle",
        getAlignmentBaseline: "center",
      }),
    activeVesselID != null &&
      layerVisibility.historicalPath.visible &&
      new PathLayer({
        id: "historical-path-layer",
        data: activeVessel,
        getPath: (d) => d.historical_path,
        getColor: [100, 100, 120],
        opacity: 1,
        getWidth: 10,
        rounded: true,
        widthMinPixels: 8,
        coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
      }),
    activeVesselID != null &&
      layerVisibility.futurePath.visible &&
      new PathLayer({
        id: "future-path-layer",
        data: activeVessel,
        getPath: (d) => d.future_path,
        getColor: (d) => [80, 200, 192],
        getWidth: 10,
        opacity: 1,
        rounded: true,
        widthMinPixels: 8,
        coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
      }),
    activeVesselID != null &&
      layerVisibility.historicalTrip.visible &&
      new TripsLayer({
        id: "historical-trips-layer",
        data: activeVessel,
        coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
        getPath: (d) => d.historical_path,
        getTimestamps: (d) => d.historical_timestamps,
        getColor: [255, 120, 89],
        opacity: 1,
        widthMinPixels: 10,
        rounded: true,
        trailLength: 5000,
        currentTime: time,
        shadowEnabled: false,
      }),
    activeVesselID != null &&
      layerVisibility.futureTrip.visible &&
      new TripsLayer({
        id: "future-trips-layer",
        data: activeVessel,
        coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
        getPath: (d) => d.future_path,
        getTimestamps: (d) => d.future_timestamps,
        getColor: [80, 255, 120],
        opacity: 1,
        widthMinPixels: 10,
        rounded: true,
        trailLength: 5000,
        currentTime: time,
        shadowEnabled: false,
      }),
    layerVisibility.vesselIcon.visible &&
      new IconLayer({
        id: "vessel-icon-layer",
        data: visibleVessels,
        coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
        iconAtlas: require("img/vessel_marker.png"),
        iconMapping: {
          vesselMarker: { x: 0, y: 0, width: 64, height: 64, mask: false },
        },
        getIcon: (d) => "vesselMarker",
        getPosition: (d) => [d.longitude, d.latitude, 0],
        getAngle: (d) => 360 - d.heading,
        getSize: (d) => 300,
        sizeUnits: "meters",
        sizeScale: 1,
        sizeMinPixels: 10,
        pickable: true,
        billboard: false,
        onHover: (info) =>
          setTooltipInfo({
            objectType: "vessel",
            hoveredObject: info.object,
            pointerX: info.x,
            pointerY: info.y,
            coordinate: info.coordinate,
          }),
        onClick: (info) => _clickVesselEvent(info.object.mmsi),
      }),
    activeVesselID != null &&
      layerVisibility.vesselIcon.visible &&
      new IconLayer({
        id: "active-vessel-icon-layer",
        data: activeVessel,
        coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
        iconAtlas: require("img/vessel_marker_active.png"),
        iconMapping: {
          vesselMarker: { x: 0, y: 0, width: 64, height: 64, mask: false },
        },
        getIcon: (d) => "vesselMarker",
        getPosition: (d) => [d.longitude, d.latitude, 0],
        getAngle: (d) => 360 - d.heading,
        getSize: (d) => 300,
        sizeUnits: "meters",
        sizeScale: 2,
        sizeMinPixels: 15,
        billboard: false,
        pickable: true,
        onHover: (info) =>
          setTooltipInfo({
            objectType: "vessel",
            hoveredObject: info.object,
            pointerX: info.x,
            pointerY: info.y,
            coordinate: info.coordinate,
          }),
      }),
  ].filter(Boolean);

  return (
    <div>
      <DeckGL
        views={VIEWS}
        layers={layers}
        controller={true}
        getCursor={() => "crosshair"}
        viewState={{
          main: {
            ...mapView.viewStates.main,
            transitionDuration: "auto",
            transitionInterpolator: new FlyToInterpolator({ speed: 2 }),
          },
          minimap: {
            ...mapView.viewStates.minimap,
            transitionDuration: "auto",
            transitionInterpolator: new FlyToInterpolator({ speed: 2 }),
          },
        }}
        onViewStateChange={_onViewStateChange}
      >
        <StaticMap
          reuseMaps
          mapStyle={props.mapStyle}
          preventStyleDiffing={true}
          mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
        ></StaticMap>
        {mapView.miniMapViewEnabled && (
          <View id="minimap">
            <StaticMap
              reuseMaps
              mapStyle={props.mapStyle}
              preventStyleDiffing={true}
              mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
            />
          </View>
        )}
        {_renderTooltip()}
      </DeckGL>
    </div>
  );
};

export default MapContainer;
