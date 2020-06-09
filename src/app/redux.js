import {
  configureStore,
  createSlice,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";

import { FlyToInterpolator } from "deck.gl";

const INITIAL_VIEWSTATES = {
  main: {
    longitude: 103.8198,
    latitude: 1.2521,
    zoom: 10,
    pitch: 0,
    bearing: 0,
    transitionDuration: "auto",
    transitionInterpolator: new FlyToInterpolator({ speed: 2 }),
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
  riskScreenGrid: { layerName: "Collision Risk Screen Grid", visible: false },
  riskHexagon: { layerName: "Collision Risk Hexagon Grid", visible: true },
  historicalPath: { layerName: "Historical Path", visible: true },
  futurePath: { layerName: "Future Path", visible: true },
  historicalTrip: { layerName: "Historical Trip", visible: false },
  futureTrip: { layerName: "Future Trip", visible: false },
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

// define reducers
const reducer = {
  mapView: mapViewSlice.reducer,
  panelOpen: panelOpenSlice.reducer,
  layerVisibility: layerVisibilitySlice.reducer,
  darkThemeEnabled: themeSlice.reducer,
  activeVesselID: activeVesselSlice.reducer,
};

// define middleware
const middleware = [...getDefaultMiddleware()];

// export store
export default configureStore({
  reducer,
  middleware,
});
