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

const panelOpenInitialState = {
  controlPanel: {
    panelName: "Control Panel",
    isOpen: true,
  },
  detialsPanel: {
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
  historicalTrip: { layerName: "Historical Trip", visible: true },
  futureTrip: { layerName: "Future Trip", visible: true },
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
  toggleOpen: togglePanelOpenActionCreator,
} = panelOpenSlice.actions;
export const {
  toggleVisibility: toggleLayerVisibilityActionCreator,
} = layerVisibilitySlice.actions;
export const { toggle: toggleThemeActionCreator } = themeSlice.actions;
export const { set: setActiveVesselActionCreator } = activeVesselSlice.actions;

// define reducers
const reducer = {
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
