import {
  configureStore,
  createSlice,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
// import logger from "redux-logger";

// const sidePanelTabsInitialState = {
//   activePanel: "data",
// };

// const sidePanelTabsSlice = createSlice({
//   name: "sidePanelTabs",
//   initialState: sidePanelTabsInitialState,
//   reducers: {
//     filter: (state, { payload }) => {
//       const selectedTab = state.find((tab) => tab.id === tab.id);
//       state.activePanel = selectedTab.id;
//     },
//   },
// });

// const layerVisibilityInitialState = [
//   { id: "risk-screen-grid-layer", visible: true },
//   { id: "risk-hexagon-layer", visible: true },
//   { id: "historical-path-layer", visible: true },
//   { id: "future-path-layer", visible: true },
//   { id: "historical-trips-layer", visible: true },
//   { id: "future-trips-layer", visible: true },
//   { id: "vessel-icon-layer", visible: true },
// ];

const layerVisibilityInitialState = {
  riskScreenGrid: {
    id: "risk-screen-grid-layer",
    label: "Collision Risk Screen Grid",
    visible: false,
  },
  riskHexagon: {
    id: "risk-hexagon-layer",
    label: "Collision Risk Hexagon Grid",
    visible: true,
  },
  historicalPath: {
    id: "historical-path-layer",
    label: "Historical Path",
    visible: true,
  },
  futurePath: { id: "future-path-layer", label: "Future Path", visible: true },
  historicalTrip: {
    id: "historical-trip-layer",
    label: "Historical Trip",
    visible: true,
  },
  futureTrip: { id: "future-trip-layer", label: "Future Trip", visible: true },
  vesselIcon: { id: "vessel-icon-layer", label: "Vessels", visible: true },
};

const layerVisibilitySlice = createSlice({
  name: "layerVisibility",
  initialState: layerVisibilityInitialState,
  reducers: {
    toggleVisibility: (state, { payload }) => {
      const layer =
        state[Object.keys(state).find((key) => state[key].id === payload)];
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
  toggleVisibility: toggleLayerVisibilityActionCreator,
} = layerVisibilitySlice.actions;
export const { toggle: toggleThemeActionCreator } = themeSlice.actions;
export const { set: setActiveVesselActionCreator } = activeVesselSlice.actions;

// define reducers
const reducer = {
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
