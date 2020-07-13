import React from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";

import {
  toggleThemeActionCreator,
  toggleVesselViewActionCreator,
  toggleMiniMapViewActionCreator,
  setViewStatesActionCreator,
  resetViewStatesActionCreator,
} from "app/Redux";
import MapControlToggle from "./MapControlToggle";

const StyledPanelContent = styled.div`
  background-color: ${(props) => props.theme.sidePanelBg};
  width: 100%;
  height: 100%;
  color: ${(props) => props.theme.textColor};
`;

const MapManagerPanel = () => {
  // Redux states
  const dispatch = useDispatch();
  const darkThemeEnabled = useSelector((state) => state.darkThemeEnabled);
  const toggleTheme = () => {
    dispatch(toggleThemeActionCreator());
  };
  const mapView = useSelector((state) => state.mapView);
  const toggleVesselView = () => {
    if (mapView.vesselViewEnabled) {
      // if from true to false
      dispatch(resetViewStatesActionCreator());
    } else {
      // if from false to true
      dispatch(setViewStatesActionCreator(mapView.activeVesselViewStates));
    }
    dispatch(toggleVesselViewActionCreator());
  };
  const toggleMiniMapView = () => {
    dispatch(toggleMiniMapViewActionCreator());
  };

  return (
    <StyledPanelContent>
      <MapControlToggle
        label={"Enable Dark Theme"}
        checked={darkThemeEnabled}
        onChange={toggleTheme}
      />
      <MapControlToggle
        label={"Enable Active Vessel View"}
        checked={mapView.vesselViewEnabled}
        onChange={toggleVesselView}
      />{" "}
      <MapControlToggle
        label={"Enable Mini Map"}
        checked={mapView.miniMapViewEnabled}
        onChange={toggleMiniMapView}
      />
    </StyledPanelContent>
  );
};

export default MapManagerPanel;
