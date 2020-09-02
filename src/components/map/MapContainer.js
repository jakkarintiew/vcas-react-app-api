import React, { useState, useEffect } from "react";
import axios from "axios";

import "mapbox-gl/dist/mapbox-gl.css";
import StaticMap, { TRANSITION_EVENTS } from "react-map-gl";
import DeckGL from "@deck.gl/react";
import {
  IconLayer,
  PathLayer,
  HeatmapLayer,
  ScreenGridLayer,
  HexagonLayer,
  PolygonLayer,
  TextLayer,
  COORDINATE_SYSTEM,
  FlyToInterpolator,
} from "deck.gl";
import { PathStyleExtension } from "@deck.gl/extensions";
import { View, MapView } from "@deck.gl/core";

import { useSelector, useDispatch } from "react-redux";
import {
  setViewStatesActionCreator,
  storeActiveVesselViewStatesActionCreator,
  setActivePathActionCreator,
  setActiveFuturePathActionCreator,
  setActiveHistoricalPathActionCreator,
  setHighRiskPathsActionCreator,
  setAlertPathsActionCreator,
  setActiveVesselsActionCreator,
  setAlertVesselsActionCreator,
} from "app/Redux";

import MapTooltip from "./MapTooltip";

import dataFairways from "data/seamark_fairways.json";
import dataLanes from "data/seamark_lanes.json";
import dataLaneBoundaries from "data/seamark_separation.json";
import dataAnchorages from "data/seamark_anchorages.json";
import dataMooringAreas from "data/seamark_mooring_areas.json";
// import dataUnionMooringAreas from "data/seamark_mooring_areas_1.json";
import vesselTypeLookup from "data/vessel_type_lookup.json";

const FRAMES_DIR =
  "https://raw.githubusercontent.com/jakkarintiew/frames-data/master/frames_20s/";

const MapContainer = ({ closeEncounters, mapStyle }) => {
  // Set your mapbox access token here
  const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
  // Redux states
  const dispatch = useDispatch();
  const layerVisibility = useSelector((state) => state.layerVisibility);
  const mapView = useSelector((state) => state.mapView);
  const vesselTypeFilter = useSelector((state) => state.vesselTypeFilter);
  const vesselSliderFilter = useSelector((state) => state.vesselSliderFilter);
  const currentFrame = useSelector((state) => state.frames.currentFrame);
  const allVessels = useSelector((state) => state.vesselData.allVesselData);
  const activeVessels = useSelector(
    (state) => state.vesselData.activeVesselData
  );
  const activePathData = useSelector((state) => state.pathData.activePathData);
  const activeFuturePath = useSelector(
    (state) => state.pathData.activeFuturePath
  );
  const activeHistoricalPath = useSelector(
    (state) => state.pathData.activeHistoricalPath
  );
  const highRiskPaths = useSelector((state) => state.pathData.highRiskPathData);
  const alertVessels = useSelector((state) => state.vesselData.alertVesselData);
  const alertPaths = useSelector((state) => state.pathData.alertPathData);
  const alertColors = useSelector((state) => state.vesselData.alertColors);
  const setActiveVessels = (vessel) => {
    dispatch(setActiveVesselsActionCreator(vessel));
  };
  const setAlertVessels = (vessel) => {
    dispatch(setAlertVesselsActionCreator(vessel));
  };

  const setViewStates = (newViewState) => {
    dispatch(setViewStatesActionCreator(newViewState));
  };
  const storeActiveVesselViewStates = (vesselViewState) => {
    dispatch(storeActiveVesselViewStatesActionCreator(vesselViewState));
  };
  const setActivePath = (path) => {
    dispatch(setActivePathActionCreator(path));
  };
  const setActiveFuturePath = (path) => {
    dispatch(setActiveFuturePathActionCreator(path));
  };
  const setActiveHistoricalPath = (path) => {
    dispatch(setActiveHistoricalPathActionCreator(path));
  };
  const setHighRiskPaths = (paths) => {
    dispatch(setHighRiskPathsActionCreator(paths));
  };
  const setAlertPaths = (paths) => {
    dispatch(setAlertPathsActionCreator(paths));
  };

  // View states functions
  const onViewStateChange = ({ viewId, viewState }) => {
    // console.log(viewId);
    // console.log(viewState);

    const currentViewStates = mapView.viewStates;

    if (viewId === "main") {
      setViewStates({
        main: viewState,
        minimap: {
          ...currentViewStates.minimap,
          // longitude: viewState.longitude,
          // latitude: viewState.latitude,
        },
      });
    } else {
      setViewStates({
        main: {
          ...currentViewStates.main,
          // longitude: viewState.longitude,
          // latitude: viewState.latitude,
        },
        minimap: viewState,
      });
    }
  };

  const VIEWS = [
    new MapView({
      id: "main",
      controller: true,
    }),
    mapView.miniMapViewEnabled &&
      new MapView({
        id: "minimap",
        x: "17%",
        y: "65%",
        width: "300px",
        height: "300px",
        controller: true,
        clear: true,
      }),
  ].filter(Boolean);

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

  // Vessel data
  const visibleVessels = allVessels.filter((vessel) => {
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

  const movingVessels = visibleVessels.filter((vessel) => {
    return vessel.speed >= 1;
  });

  const stoppedVessels = visibleVessels.filter((vessel) => {
    return vessel.speed < 1;
  });

  const highRiskVessels = movingVessels.filter((vessel) => {
    return vessel.risk > 75;
  });

  const pathDataInitialState = [
    {
      path: [],
      timestamps: [],
      speed: [],
      heading: [],
      course: [],
      risk: [],
    },
  ];

  const getPath = async (vesselID) => {
    try {
      const promisePath = await axios.get(
        FRAMES_DIR + `paths_new/${vesselID}_path.json`
      );
      return promisePath.data;
    } catch (error) {
      console.log(error);
    }
  };

  const getFuturePath = (pathData) => {
    let currentIndex = pathData.findIndex((obj) => obj.frame === currentFrame);
    let filteredPath;
    for (let index = currentIndex; index <= pathData.length - 1; index++) {
      if (currentIndex === pathData.length - 1) {
        return pathDataInitialState;
      } else if (
        index === pathData.length - 1 ||
        pathData[index + 1].frame - pathData[index].frame > 1
      ) {
        filteredPath = pathData.filter((elem) => {
          return (
            elem.frame >= currentFrame && elem.frame <= pathData[index].frame
          );
        });
        return [
          {
            path: filteredPath.map((frame) => [
              frame.longitude,
              frame.latitude,
            ]),
            timestamps: filteredPath.map((frame) => frame.timestamp),
            speed: filteredPath.map((frame) => frame.speed),
            heading: filteredPath.map((frame) => frame.heading),
            course: filteredPath.map((frame) => frame.course),
            risk: filteredPath.map((frame) => frame.risk),
          },
        ];
      }
    }
  };

  const getHistoricalPath = (pathData) => {
    let currentIndex = pathData.findIndex((obj) => obj.frame === currentFrame);
    let filteredPath;
    for (let index = currentIndex; index >= 0; index--) {
      if (currentIndex === 0) {
        return pathDataInitialState;
      } else if (
        index === 0 ||
        pathData[index].frame - pathData[index - 1].frame > 1
      ) {
        filteredPath = pathData.filter((elem) => {
          return (
            elem.frame >= pathData[index].frame && elem.frame <= currentFrame
          );
        });
        return [
          {
            path: filteredPath.map((frame) => [
              frame.longitude,
              frame.latitude,
            ]),
            timestamps: filteredPath.map((frame) => frame.timestamp),
            speed: filteredPath.map((frame) => frame.speed),
            heading: filteredPath.map((frame) => frame.heading),
            course: filteredPath.map((frame) => frame.course),
            risk: filteredPath.map((frame) => frame.risk),
          },
        ];
      }
    }
  };

  const getHighRiskPaths = (highRiskVessels) => {
    const promiseRiskPaths = [];
    const newRiskPaths = [];
    highRiskVessels.forEach((vessel) => {
      promiseRiskPaths.push(getPath(vessel.mmsi));
    });

    Promise.all(promiseRiskPaths)
      .then((responses) => {
        responses.forEach((path) => {
          newRiskPaths.push(getFuturePath(path)[0]);
        });
        setHighRiskPaths(newRiskPaths);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    setHighRiskPaths([]);
    if (layerVisibility.riskPath.visible) {
      getHighRiskPaths(highRiskVessels);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allVessels, layerVisibility]);

  useEffect(() => {
    if (activePathData.length > 0) {
      setActiveFuturePath(getFuturePath(activePathData));
      setActiveHistoricalPath(getHistoricalPath(activePathData));

      if (activeVessels.length !== 0) {
        const newActiveVessel = visibleVessels.filter((vessel) => {
          return vessel.mmsi === activeVessels[0].mmsi;
        });
        setActiveVessels(newActiveVessel);
        const vesselViewState = {
          longitude: newActiveVessel[0].longitude,
          latitude: newActiveVessel[0].latitude,
          zoom: 13,
          pitch: 60,
          bearing: newActiveVessel[0].heading,
          transitionDuration: 500,
          transitionInterruption: TRANSITION_EVENTS.UPDATE,
          transitionInterpolator: new FlyToInterpolator(),
        };
        updateVesselViewState(vesselViewState);
      }

      if (alertVessels.length !== 0) {
        const newAlertVessels = allVessels.filter((vessel) => {
          return alertVessels.map((v) => v.mmsi).includes(vessel.mmsi);
        });
        setAlertVessels(newAlertVessels);
        // Get paths
        let alertPathsPromises = [];
        let newAlertPaths = [];

        newAlertVessels.forEach((vessel) => {
          alertPathsPromises.push(getPath(vessel.mmsi));
        });

        Promise.all(alertPathsPromises)
          .then((responses) => {
            responses.forEach((path) => {
              newAlertPaths.push(getFuturePath(path)[0]);
            });
            setAlertPaths(newAlertPaths);
          })
          .catch((error) => console.log(error));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFrame]);

  let activeMMSI = null;
  if (activeVessels.length > 0) {
    activeMMSI = activeVessels[0].mmsi;
  }

  useEffect(() => {
    if (activeMMSI) {
      Promise.resolve(getPath(activeVessels[0].mmsi)).then((response) => {
        setActivePath(response);
        setActiveFuturePath(getFuturePath(response));
        setActiveHistoricalPath(getHistoricalPath(response));
      });
      const vesselViewState = {
        longitude: activeVessels[0].longitude,
        latitude: activeVessels[0].latitude,
        zoom: 13,
        pitch: 60,
        bearing: activeVessels[0].heading,
        transitionDuration: 500,
        transitionInterruption: TRANSITION_EVENTS.UPDATE,
        transitionInterpolator: new FlyToInterpolator(),
      };
      updateVesselViewState(vesselViewState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMMSI]);

  const clickVesselEvent = (mmsi) => {
    // Reset
    setActivePath(pathDataInitialState);
    setActiveFuturePath(pathDataInitialState);
    setActiveHistoricalPath(pathDataInitialState);
    setAlertPaths([]);
    setAlertVessels([]);
    const newActiveVessel = visibleVessels.filter((vessel) => {
      return vessel.mmsi === mmsi;
    });
    setActiveVessels(newActiveVessel);
  };

  const clickAlertEvent = (object) => {
    // Reset active vessel
    setActiveVessels([]);

    // Zoom to event
    setViewStates({
      main: {
        ...mapView.viewStates.main,
        longitude: object.vessel_1_longitude,
        latitude: object.vessel_1_latitude,
        zoom: 12,
        pitch: 0,
        bearing: 0,
        transitionDuration: 500,
        transitionInterruption: TRANSITION_EVENTS.UPDATE,
        transitionInterpolator: new FlyToInterpolator(),
      },
      minimap: {
        ...mapView.viewStates.minimap,
        longitude: object.vessel_1_longitude,
        latitude: object.vessel_1_latitude,
      },
    });

    // Get vessels
    setAlertVessels(
      allVessels.filter((vessel) => {
        return (
          vessel.mmsi === object.vessel_1_mmsi ||
          vessel.mmsi === object.vessel_2_mmsi
        );
      })
    );

    // Get paths
    let alertPathsPromises = [];
    let newAlertPaths = [];
    alertPathsPromises.push(getPath(object.vessel_1_mmsi));
    alertPathsPromises.push(getPath(object.vessel_2_mmsi));

    Promise.all(alertPathsPromises)
      .then((responses) => {
        responses.forEach((path) => {
          newAlertPaths.push(getFuturePath(path)[0]);
        });
        setAlertPaths(newAlertPaths);
      })
      .catch((error) => console.log(error));
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

  const layers = [
    layerVisibility.fairwayPolygon.visible &&
      new PolygonLayer({
        id: "fairways-polygon-layer",
        data: dataFairways,
        stroked: true,
        filled: true,
        lineWidthMinPixels: 1,
        getPolygon: (d) => d.coordinates,
        getFillColor: [200, 152, 210, 100],
        getLineColor: [180, 132, 190],
        getLineWidth: 1,
        pickable: true,
        autoHighlight: true,
        highlightColor: [220, 182, 225, 200],
        onHover: (info) =>
          setTooltipInfo({
            objectType: "fairway",
            hoveredObject: info.object,
            pointerX: info.x,
            pointerY: info.y,
            coordinate: info.centroid,
          }),
      }),
    layerVisibility.lanePolygon.visible &&
      new PathLayer({
        id: "lanes-path-layer",
        data: dataLanes,
        getPath: (d) => d.coordinates,
        getColor: [180, 132, 190],
        opacity: 1,
        getWidth: 2,
        rounded: false,
        widthMinPixels: 2,
        coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
        pickable: true,
        autoHighlight: true,
        highlightColor: [250, 182, 255, 220],
        onHover: (info) =>
          setTooltipInfo({
            objectType: "fairway",
            hoveredObject: info.object,
            pointerX: info.x,
            pointerY: info.y,
            coordinate: info.centroid,
          }),
      }),
    layerVisibility.lanePolygon.visible &&
      new PathLayer({
        id: "lane-boundary-path-layer",
        data: dataLaneBoundaries,
        getPath: (d) => d.coordinates,
        getColor: [140, 140, 140],
        opacity: 1,
        getWidth: 1,
        rounded: false,
        widthMinPixels: 1,
        coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
        pickable: true,
        autoHighlight: true,
        highlightColor: [180, 180, 180, 220],
        onHover: (info) =>
          setTooltipInfo({
            objectType: "fairway",
            hoveredObject: info.object,
            pointerX: info.x,
            pointerY: info.y,
            coordinate: info.centroid,
          }),
        getDashArray: [10, 10],
        dashJustified: true,
        extensions: [new PathStyleExtension({ dash: true })],
      }),
    layerVisibility.mooringPolygon.visible &&
      new PolygonLayer({
        id: "mooring-polygon-layer",
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
    layerVisibility.riskHeatmap.visible &&
      new HeatmapLayer({
        id: "risk-heatmap-layer",
        data: movingVessels.filter((vessel) => vessel.risk > 50),
        getPosition: (d) => [d.longitude, d.latitude],
        getWeight: (d) => d.risk,
        radiusPixels: 50,
        // 5000 /
        // (78271.484 * Math.exp(-0.6932415 * mapView.viewStates.main.zoom)),
        opacity: 0.1,
        intensity: 1,
        threshold: 0.01,
      }),
    layerVisibility.riskScreenGrid.visible &&
      new ScreenGridLayer({
        id: "risk-screen-grid-layer",
        data: highRiskVessels,
        pickable: false,
        opacity: 0.15,
        cellSizePixels: 64,
        getPosition: (d) => [d.longitude, d.latitude],
      }),
    layerVisibility.riskHexagon.visible &&
      new HexagonLayer({
        id: "risk-hexagon-layer",
        data: highRiskVessels,
        lowerPercentile: 0,
        extruded: false,
        radius:
          78271.484 * Math.exp(-0.6932415 * mapView.viewStates.main.zoom) * 50,
        opacity: 0.15,
        coverage: 0.98,
        getPosition: (d) => [d.longitude, d.latitude],
      }),
    layerVisibility.riskPath.visible &&
      new PathLayer({
        id: "risk-path-border-layer",
        data: highRiskPaths,
        getPath: (d) => d.path,
        getColor: [141, 0, 0],
        opacity: 1,
        widthUnits: "meters",
        getWidth: 80,
        rounded: true,
        widthMinPixels: 7,
        coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
      }),
    layerVisibility.riskPath.visible &&
      new PathLayer({
        id: "risk-path-layer",
        data: highRiskPaths,
        getPath: (d) => d.path,
        getColor: [252, 72, 80],
        opacity: 1,
        widthUnits: "meters",
        getWidth: 60,
        rounded: true,
        widthMinPixels: 5,
        coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
      }),
    layerVisibility.alertIcon.visible &&
      new PathLayer({
        id: "alert-path-border-layer",
        data: alertPaths,
        getPath: (d) => d.path,
        getColor: (d) => alertColors[alertPaths.indexOf(d)].borderRGB,
        widthUnits: "meters",
        getWidth: 80,
        rounded: true,
        widthMinPixels: 9,
        coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
      }),
    layerVisibility.alertIcon.visible &&
      new PathLayer({
        id: "alert-path-layer",
        data: alertPaths,
        getPath: (d) => d.path,
        getColor: (d) => alertColors[alertPaths.indexOf(d)].fillRGB,
        widthUnits: "meters",
        getWidth: 60,
        rounded: true,
        widthMinPixels: 6,
        coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
      }),
    layerVisibility.alertIcon.visible &&
      new IconLayer({
        id: "warning-icon-layer",
        data: closeEncounters,
        coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
        iconAtlas: require("img/warning_red.png"),
        iconMapping: {
          warningMarker: { x: 0, y: 0, width: 300, height: 300, mask: false },
        },
        getIcon: (d) => "warningMarker",
        getPosition: (d) => [
          (d.vessel_1_longitude + d.vessel_2_longitude) / 2,
          (d.vessel_1_latitude + d.vessel_2_latitude) / 2,
          200,
        ],
        getSize: (d) => 600,
        sizeUnits: "meters",
        sizeScale: 1,
        sizeMinPixels: 30,
        sizeMaxPixels: 400,
        billboard: true,
        pickable: true,
        onClick: (info) => clickAlertEvent(info.object),
      }),
    activeVessels.length > 0 &&
      layerVisibility.historicalPath.visible &&
      new PathLayer({
        id: "historical-path-border-layer",
        data: activeHistoricalPath,
        getPath: (d) => d.path,
        getColor: [100, 100, 100],
        opacity: 1,
        widthUnits: "meters",
        getWidth: 80,
        rounded: true,
        widthMinPixels: 9,
        coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
      }),
    activeVessels.length > 0 &&
      layerVisibility.historicalPath.visible &&
      new PathLayer({
        id: "historical-path-layer",
        data: activeHistoricalPath,
        getPath: (d) => d.path,
        getColor: [150, 150, 150],
        opacity: 1,
        widthUnits: "meters",
        getWidth: 60,
        rounded: true,
        widthMinPixels: 6,
        coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
      }),
    activeVessels.length > 0 &&
      layerVisibility.futurePath.visible &&
      new PathLayer({
        id: "future-path-border-layer",
        data: activeFuturePath,
        getPath: (d) => d.path,
        getColor: [25, 120, 180],
        widthUnits: "meters",
        getWidth: 80,
        rounded: true,
        widthMinPixels: 9,
        coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
      }),
    activeVessels.length > 0 &&
      layerVisibility.futurePath.visible &&
      new PathLayer({
        id: "future-path-layer",
        data: activeFuturePath,
        getPath: (d) => d.path,
        getColor: [41, 168, 255],
        widthUnits: "meters",
        getWidth: 60,
        rounded: true,
        widthMinPixels: 6,
        coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
      }),
    layerVisibility.stoppedVesselIcon.visible &&
      new IconLayer({
        id: "stopped-vessel-icon-border-layer",
        data: stoppedVessels,
        coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
        iconAtlas: require("img/vessel_marker.png"),
        iconMapping: {
          vesselMarker: { x: 0, y: 0, width: 512, height: 512, mask: true },
        },
        getColor: (d) => [255, 255, 255, 255],
        getIcon: (d) => "vesselMarker",
        getPosition: (d) => [d.longitude, d.latitude, 0],
        getAngle: (d) => 360 - d.heading,
        getSize: (d) => 300,
        sizeUnits: "meters",
        sizeScale: 1.8,
        sizeMinPixels: 14,
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
    layerVisibility.stoppedVesselIcon.visible &&
      new IconLayer({
        id: "stopped-vessel-icon-layer",
        data: stoppedVessels,
        coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
        iconAtlas: require("img/vessel_marker.png"),
        iconMapping: {
          vesselMarker: { x: 0, y: 0, width: 512, height: 512, mask: true },
        },
        getColor: [120, 120, 120, 255],
        getIcon: (d) => "vesselMarker",
        getPosition: (d) => [d.longitude, d.latitude, 0],
        getAngle: (d) => 360 - d.heading,
        getSize: (d) => 300,
        sizeUnits: "meters",
        sizeScale: 1,
        sizeMinPixels: 8,
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
    layerVisibility.movingVesselIcon.visible &&
      new IconLayer({
        id: "vessel-icon-border-layer",
        data: movingVessels,
        coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
        iconAtlas: require("img/vessel_marker.png"),
        iconMapping: {
          vesselMarker: { x: 0, y: 0, width: 512, height: 512, mask: true },
        },
        getColor: (d) => [255, 255, 255, 255],
        getIcon: (d) => "vesselMarker",
        getPosition: (d) => [d.longitude, d.latitude, 0],
        getAngle: (d) => 360 - d.heading,
        getSize: (d) => 300,
        sizeUnits: "meters",
        sizeScale: 1.8,
        sizeMinPixels: 14,
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
    layerVisibility.movingVesselIcon.visible &&
      new IconLayer({
        id: "vessel-icon-layer",
        data: movingVessels,
        coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
        iconAtlas: require("img/vessel_marker.png"),
        iconMapping: {
          vesselMarker: { x: 0, y: 0, width: 512, height: 512, mask: true },
        },
        getColor: (d) =>
          activeVessels.filter((vessel) => {
            return vessel.mmsi === d.mmsi;
          }).length > 0
            ? [89, 173, 255]
            : alertVessels.filter((vessel) => {
                return vessel.mmsi === d.mmsi;
              }).length > 0
            ? alertColors[
                alertVessels.indexOf(
                  alertVessels.find((vessel) => {
                    return vessel.mmsi === d.mmsi;
                  })
                )
              ].fillRGB
            : d.risk > 75
            ? [252, 40, 20]
            : d.risk > 50
            ? [255, 160, 0]
            : [52, 199, 89],
        getIcon: (d) => "vesselMarker",
        getPosition: (d) => [d.longitude, d.latitude, 0],
        getAngle: (d) => 360 - d.heading,
        getSize: (d) => 300,
        sizeUnits: "meters",
        sizeScale: 1,
        sizeMinPixels: 8,
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
  ].filter(Boolean);

  return (
    <DeckGL
      views={VIEWS}
      layers={layers}
      controller={true}
      getCursor={() => "crosshair"}
      viewState={mapView.viewStates}
      onViewStateChange={onViewStateChange}
    >
      <StaticMap
        reuseMaps
        mapStyle={mapStyle}
        preventStyleDiffing={true}
        mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
      ></StaticMap>
      <View id="minimap">
        <StaticMap
          reuseMaps
          mapStyle={mapStyle}
          preventStyleDiffing={true}
          mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
        />
      </View>
      {renderTooltip()}
    </DeckGL>
  );
};

export default MapContainer;
