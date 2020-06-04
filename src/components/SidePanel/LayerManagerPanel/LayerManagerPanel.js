import React from "react";
import styled from "styled-components";

import LayerVisibilityCheckBox from "./LayerVisibilityCheckBox";

const StyledPanelContent = styled.div`
  background-color: ${(props) => props.theme.sidePanelBg};
  width: 100%;
  height: 100%;
  color: ${(props) => props.theme.textColor};
`;

const LayerManagerPanel = () => {
  return (
    <div>
      <StyledPanelContent>
        <LayerVisibilityCheckBox layerName={"Vessels"} />
        <LayerVisibilityCheckBox layerName={"Historical Path"} />
        <LayerVisibilityCheckBox layerName={"Future Path"} />
        <LayerVisibilityCheckBox layerName={"Historical Trip"} />
        <LayerVisibilityCheckBox layerName={"Future Trip"} />
        <LayerVisibilityCheckBox layerName={"Collision Risk Hexagon Grid"} />
        <LayerVisibilityCheckBox layerName={"Collision Risk Screen Grid"} />
      </StyledPanelContent>
    </div>
  );
};

export default LayerManagerPanel;
