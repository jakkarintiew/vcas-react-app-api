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

// const mapLayersInitialState = [
//   {
//     id: "heatmap-layer",
//     visible: true,
//     order: 0,
//   },
//   {
//     id: "screen-grid-layer",
//     visible: true,
//     order: 1,
//   },
//   {
//     id: "hexagon-layer",
//     visible: true,
//     order: 2,
//   },
//   {
//     id: "path-layer",
//     visible: true,
//     order: 3,
//   },
//   {
//     id: "scatter-plot-layer",
//     visible: true,
//     order: 4,
//   },
//   {
//     id: "icon-layer",
//     visible: true,
//     order: 5,
//   },
//   {
//     id: "trips-layer",
//     visible: true,
//     order: 6,
//   },
// ];

// const mapLayersSlice = createSlice({
//   name: "mapLayers",
//   initialState: mapLayersInitialState,
//   reducers: {
//     filter: (state, { payload }) => {
//       const layer = state.find((layer) => layer.id === payload.id);
//       layer.visible = !layer.visible;
//     },
//   },
// });

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
export const { toggle: toggleThemeActionCreator } = themeSlice.actions;
export const { set: setActiveVesselActionCreator } = activeVesselSlice.actions;

// define reducers
const reducer = {
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
