import React from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";

import {
  toggleThemeActionCreator,
  toggleVesselViewActionCreator,
  setViewStateActionCreator,
  resetViewStateActionCreator,
} from "app/redux";
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
    if (mapView.activeVesselView) {
      // if from true to false
      dispatch(resetViewStateActionCreator());
    } else {
      // if from false to true
      dispatch(setViewStateActionCreator(mapView.activeVesselViewState));
    }
    dispatch(toggleVesselViewActionCreator());
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
        checked={mapView.activeVesselView}
        onChange={toggleVesselView}
      />
    </StyledPanelContent>
  );
};

export default MapManagerPanel;
