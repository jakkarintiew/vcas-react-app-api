import React, { useState, useEffect } from "react";

import "mapbox-gl/dist/mapbox-gl.css";
import StaticMap, { TRANSITION_EVENTS } from "react-map-gl";
import DeckGL from "@deck.gl/react";
import {
  IconLayer,
  PathLayer,
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

import dataAnchorages from "data/seamark_anchorages.json";
import dataMooringAreas from "data/seamark_dredged_areas.json";
import vesselTypeLookup from "data/vessel_type_lookup.json";

const MapContainer = ({
  vesselsData,
  activeVesselsData,
  historicalPathData,
  futurePathData,
  mapStyle,
}) => {
  // Set your mapbox access token here
  const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

  // Redux states
  const dispatch = useDispatch();
  const layerVisibility = useSelector((state) => state.layerVisibility);
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
  const vesselTypeFilter = useSelector((state) => state.vesselTypeFilter);
  const vesselSliderFilter = useSelector((state) => state.vesselSliderFilter);

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

  const onViewStateChange = ({ viewState, viewId }) => {
    const newViewStates = {
      ...mapView.viewStates,
    };
    // Update a single view
    newViewStates[viewId] = viewState;
    // Save the view state and trigger rerender
    setViewStates(newViewStates);
  };

  const updateVesselViewState = (vesselViewState) => {
    if (mapView.vesselViewEnabled) {
      setViewStates({
        main: { ...vesselViewState },
        minimap: { ...vesselViewState, pitch: 0, bearing: 0 },
      });
    } else {
      setViewStates({
        main: { ...mapView.viewStates.main },
        minimap: { ...vesselViewState, zoom: 10, pitch: 0, bearing: 0 },
      });
    }
    storeActiveVesselViewStates({
      main: { ...vesselViewState },
      minimap: { ...vesselViewState, zoom: 10, pitch: 0, bearing: 0 },
    });
  };

  const clickVesselEvent = (mmsi) => {
    setActiveVesselID(mmsi);
    const newActiveVessel = vesselsData.filter((vessel) => {
      return vessel.mmsi === mmsi;
    });
    const vesselViewState = {
      longitude: newActiveVessel[0].longitude,
      latitude: newActiveVessel[0].latitude,
      zoom: 14,
      pitch: 60,
      bearing: newActiveVessel[0].heading,
      transitionDuration: 500,
      transitionInterruption: TRANSITION_EVENTS.UPDATE,
      transitionInterpolator: new FlyToInterpolator(),
    };
    updateVesselViewState(vesselViewState);
  };

  const [tooltipInfo, setTooltipInfo] = useState({
    objectType: "",
    hoveredObject: "",
    pointerX: 0.0,
    pointerY: 0.0,
    coordinate: [0.0, 0.0],
  });

  const renderTooltip = () => {
    const { hoveredObject } = tooltipInfo;
    return hoveredObject && <MapTooltip tooltipInfo={tooltipInfo} />;
  };

  const riskyVessels = vesselsData.filter((vessel) => {
    return vessel.risk > 50;
  });

  const visibleVessels = vesselsData.filter((vessel) => {
    const visibleTypes = vesselTypeFilter.map((vessel) => {
      return vessel.filterState ? vessel.vesselType : null;
    });
    return (
      visibleTypes.includes(vesselTypeLookup[vessel.shiptype]) &&
      vessel.risk >= vesselSliderFilter.risk[0] &&
      vessel.risk <= vesselSliderFilter.risk[1] &&
      vessel.speed >= vesselSliderFilter.speed[0] &&
      vessel.speed <= vesselSliderFilter.speed[1]
    );
  });

  useEffect(() => {
    if (activeVesselsData.length > 0) {
      const vesselViewState = {
        longitude: activeVesselsData[0].longitude,
        latitude: activeVesselsData[0].latitude,
        zoom: 14,
        pitch: 60,
        bearing: activeVesselsData[0].heading,
        transitionDuration: 500,
        transitionInterruption: TRANSITION_EVENTS.UPDATE,
        transitionInterpolator: new FlyToInterpolator(),
      };
      updateVesselViewState(vesselViewState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeVesselsData]);

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
        data: dataMooringAreas,
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
        data: dataAnchorages,
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
        data: dataAnchorages,
        pickable: true,
        getPosition: (d) => [...d.centroid, 200],
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
    activeVesselsData.length > 0 &&
      layerVisibility.historicalPath.visible &&
      new PathLayer({
        id: "historical-path-layer",
        data: historicalPathData,
        getPath: (d) => d.path,
        getColor: [100, 100, 120],
        opacity: 1,
        getWidth: 10,
        rounded: true,
        widthMinPixels: 8,
        coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
      }),
    activeVesselsData.length > 0 &&
      layerVisibility.futurePath.visible &&
      new PathLayer({
        id: "future-path-layer",
        data: futurePathData,
        getPath: (d) => d.path,
        getColor: [80, 200, 192],
        getWidth: 10,
        opacity: 1,
        rounded: true,
        widthMinPixels: 8,
        coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
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
        onClick: (info) => clickVesselEvent(info.object.mmsi),
      }),
    activeVesselsData.length > 0 &&
      layerVisibility.vesselIcon.visible &&
      new IconLayer({
        id: "active-vessel-icon-layer",
        data: activeVesselsData,
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
    <DeckGL
      views={VIEWS}
      layers={layers}
      controller={true}
      getCursor={() => "crosshair"}
      viewState={{
        main: {
          ...mapView.viewStates.main,
        },
        minimap: {
          ...mapView.viewStates.minimap,
        },
      }}
      onViewStateChange={onViewStateChange}
    >
      <StaticMap
        reuseMaps
        mapStyle={mapStyle}
        preventStyleDiffing={true}
        mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
      ></StaticMap>
      {mapView.miniMapViewEnabled && (
        <View id="minimap">
          <StaticMap
            reuseMaps
            mapStyle={mapStyle}
            preventStyleDiffing={true}
            mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
          />
        </View>
      )}
      {renderTooltip()}
    </DeckGL>
  );
};

export default MapContainer;
