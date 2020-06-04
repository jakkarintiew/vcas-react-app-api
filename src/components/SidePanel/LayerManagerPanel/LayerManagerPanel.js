import React from "react";
import styled from "styled-components";

import LayerVisibilityToggle from "./LayerVisibilityToggle";

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
        <LayerVisibilityToggle layerName={"Vessels"} />
        <LayerVisibilityToggle layerName={"Historical Path"} />
        <LayerVisibilityToggle layerName={"Future Path"} />
        <LayerVisibilityToggle layerName={"Historical Trip"} />
        <LayerVisibilityToggle layerName={"Future Trip"} />
        <LayerVisibilityToggle layerName={"Collision Risk Hexagon Grid"} />
        <LayerVisibilityToggle layerName={"Collision Risk Screen Grid"} />
      </StyledPanelContent>
    </div>
  );
};

export default LayerManagerPanel;
