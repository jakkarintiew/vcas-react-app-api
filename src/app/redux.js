import {
  configureStore,
  createSlice,
  // getDefaultMiddleware,
} from "@reduxjs/toolkit";
import thunk from "redux-thunk";

const INITIAL_VIEWSTATES = {
  main: {
    longitude: 103.8198,
    latitude: 1.2521,
    zoom: 10,
    pitch: 0,
    bearing: 0,
  },
  minimap: {
    longitude: 103.8198,
    latitude: 1.2521,
    zoom: 10,
    pitch: 0,
    bearing: 0,
  },
};

const mapViewInitialState = {
  vesselViewEnabled: false,
  miniMapViewEnabled: false,
  initialViewStates: INITIAL_VIEWSTATES,
  viewStates: INITIAL_VIEWSTATES,
  activeVesselViewStates: INITIAL_VIEWSTATES,
};

const mapViewSlice = createSlice({
  name: "mapView",
  initialState: mapViewInitialState,
  reducers: {
    toggleVesselView: (state) => {
      state.vesselViewEnabled = !state.vesselViewEnabled;
    },
    toggleMiniMapView: (state) => {
      state.miniMapViewEnabled = !state.miniMapViewEnabled;
    },
    setViewStates: (state, { payload }) => {
      state.viewStates = payload;
    },
    resetViewStates: (state) => {
      state.viewStates.main = state.initialViewStates.main;
    },
    storeActiveVesselViewStates: (state, { payload }) => {
      state.activeVesselViewStates = payload;
    },
  },
});

const panelOpenInitialState = {
  controlPanel: {
    panelName: "Control Panel",
    isOpen: true,
  },
  detailsPanel: {
    panelName: "Details Panel",
    isOpen: false,
  },
  timeSlider: {
    panelName: "Time Slider",
    isOpen: true,
  },
};

const panelOpenSlice = createSlice({
  name: "panelOpen",
  initialState: panelOpenInitialState,
  reducers: {
    toggleOpen: (state, { payload }) => {
      const panel = state[Object.keys(state).find((key) => key === payload)];
      panel.isOpen = !panel.isOpen;
    },
  },
});

const layerVisibilityInitialState = {
  mooringPolygon: { layerName: "Mooring Areas", visible: true },
  anchorangePolygon: { layerName: "Anchorage Areas", visible: true },
  riskScreenGrid: { layerName: "Collision Risk Screen Grid", visible: false },
  riskHexagon: { layerName: "Collision Risk Hexagon Grid", visible: false },
  historicalPath: { layerName: "Historical Path", visible: true },
  futurePath: { layerName: "Future Path", visible: true },
  // historicalTrip: { layerName: "Historical Trip", visible: false },
  // futureTrip: { layerName: "Future Trip", visible: false },
  vesselIcon: { layerName: "Vessels", visible: true },
};

const layerVisibilitySlice = createSlice({
  name: "layerVisibility",
  initialState: layerVisibilityInitialState,
  reducers: {
    toggleVisibility: (state, { payload }) => {
      const layer =
        state[
          Object.keys(state).find((key) => state[key].layerName === payload)
        ];
      layer.visible = !layer.visible;
    },
  },
});

const activeVesselSlice = createSlice({
  name: "activeVesselID",
  initialState: null,
  reducers: {
    set: (state, { payload }) => payload,
  },
});

const themeSlice = createSlice({
  name: "darkThemeEnabled",
  initialState: false,
  reducers: {
    toggle: (state) => !state,
  },
});

const vesselTypeFilterInitialState = [
  { vesselType: "Not Available", filterState: true, visible: true },
  { vesselType: "Reserved", filterState: true, visible: true },
  { vesselType: "Wing In Grnd", filterState: true, visible: true },
  { vesselType: "SAR Aircraft", filterState: true, visible: true },
  { vesselType: "Fishing", filterState: true, visible: true },
  { vesselType: "Tug", filterState: true, visible: true },
  { vesselType: "Dredger", filterState: true, visible: true },
  { vesselType: "Dive Vessel", filterState: true, visible: true },
  { vesselType: "Military Ops", filterState: true, visible: true },
  { vesselType: "Sailing Vessel", filterState: true, visible: true },
  { vesselType: "Pleasure Craft", filterState: true, visible: true },
  { vesselType: "High-Speed Craft", filterState: true, visible: true },
  { vesselType: "Pilot Vessel", filterState: true, visible: true },
  { vesselType: "SAR", filterState: true, visible: true },
  { vesselType: "Port Tender", filterState: true, visible: true },
  { vesselType: "Anti-Pollution", filterState: true, visible: true },
  { vesselType: "Law Enforce", filterState: true, visible: true },
  { vesselType: "Local Vessel", filterState: true, visible: true },
  { vesselType: "Medical Trans", filterState: true, visible: true },
  { vesselType: "Special Craft", filterState: true, visible: true },
  { vesselType: "Passenger", filterState: true, visible: true },
  { vesselType: "Cargo", filterState: true, visible: true },
  { vesselType: "Cargo - Hazard A (Major)", filterState: true, visible: true },
  { vesselType: "Cargo - Hazard B", filterState: true, visible: true },
  { vesselType: "Cargo - Hazard C (Minor)", filterState: true, visible: true },
  {
    vesselType: "Cargo - Hazard D (Recognizable)",
    filterState: true,
    visible: true,
  },
  { vesselType: "Tanker", filterState: true, visible: true },
  { vesselType: "Tanker - Hazard A (Major)", filterState: true, visible: true },
  { vesselType: "Tanker - Hazard B", filterState: true, visible: true },
  { vesselType: "Tanker - Hazard C (Minor)", filterState: true, visible: true },
  {
    vesselType: "Tanker - Hazard D (Recognizable)",
    filterState: true,
    visible: true,
  },
  { vesselType: "Other", filterState: true, visible: true },
];

const vesselTypeFilterSlice = createSlice({
  name: "vesselTypeFilter",
  initialState: vesselTypeFilterInitialState,
  reducers: {
    toggle_filter: (state, { payload }) => {
      const index = state.findIndex((data) => data.vesselType === payload);
      state[index].filterState = !state[index].filterState;
    },
    search_filter: (state, { payload }) => {
      state.forEach((elem) => {
        if (elem.vesselType.toLowerCase().includes(payload.toLowerCase())) {
          elem.visible = true;
        } else {
          elem.visible = false;
        }
      });
    },
    select_all: (state) => {
      state.forEach((elem) => {
        if (elem.visible) elem.filterState = true;
      });
    },
    deselect_all: (state) => {
      state.forEach((elem) => {
        if (elem.visible) elem.filterState = false;
      });
    },
  },
});

const vesselSliderFilterSlice = createSlice({
  name: "vesselSliderFilter",
  initialState: { risk: [0, 100], speed: [0, 35] },
  reducers: {
    set_risk_range: (state, { payload }) => {
      state.risk[0] = payload[0];
      state.risk[1] = payload[1];
    },
    set_speed_range: (state, { payload }) => {
      state.speed[0] = payload[0];
      state.speed[1] = payload[1];
    },
  },
});

const framesInitialState = {
  metadata: {
    startTime: 0,
    endTime: 0,
    frames: [],
  },
  currentFrame: 0,
  loadedFrames: 0,
};

const framesSlice = createSlice({
  name: "frames",
  initialState: framesInitialState,
  reducers: {
    setMetadata: (state, { payload }) => {
      state.metadata = payload;
    },
    setCurrentFrame: (state, { payload }) => {
      state.currentFrame = payload;
    },
    setLoadedFrames: (state, { payload }) => {
      state.loadedFrames = payload;
    },
  },
});

// export actions
export const {
  toggleVesselView: toggleVesselViewActionCreator,
  toggleMiniMapView: toggleMiniMapViewActionCreator,
  setViewStates: setViewStatesActionCreator,
  resetViewStates: resetViewStatesActionCreator,
  storeActiveVesselViewStates: storeActiveVesselViewStatesActionCreator,
} = mapViewSlice.actions;

export const {
  toggleOpen: togglePanelOpenActionCreator,
} = panelOpenSlice.actions;

export const {
  toggleVisibility: toggleLayerVisibilityActionCreator,
} = layerVisibilitySlice.actions;

export const { toggle: toggleThemeActionCreator } = themeSlice.actions;

export const { set: setActiveVesselActionCreator } = activeVesselSlice.actions;

export const {
  toggle_filter: filterVesselTypeActionCreator,
  search_filter: searchFilterActionCreator,
  select_all: selectAllActionCreator,
  deselect_all: deselectAllActionCreator,
} = vesselTypeFilterSlice.actions;

export const {
  set_risk_range: setVesselRiskFilterRangeActionCreator,
  set_speed_range: setVesselSpeedFilterRangeActionCreator,
} = vesselSliderFilterSlice.actions;

export const {
  setMetadata: setMetadataActionCreator,
  setCurrentFrame: setCurrentFrameActionCreator,
  setLoadedFrames: setLoadedFramesActionCreator,
} = framesSlice.actions;

// define reducers
const reducer = {
  mapView: mapViewSlice.reducer,
  panelOpen: panelOpenSlice.reducer,
  layerVisibility: layerVisibilitySlice.reducer,
  darkThemeEnabled: themeSlice.reducer,
  activeVesselID: activeVesselSlice.reducer,
  vesselTypeFilter: vesselTypeFilterSlice.reducer,
  vesselSliderFilter: vesselSliderFilterSlice.reducer,
  frames: framesSlice.reducer,
};

// define middleware
// const middleware = [...getDefaultMiddleware({ serializableCheck: false })];
const middleware = [thunk];
// export store
export default configureStore({
  reducer,
  middleware,
});
