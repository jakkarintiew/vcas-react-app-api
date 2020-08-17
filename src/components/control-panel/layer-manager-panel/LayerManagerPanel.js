import React from "react";
import styled from "styled-components";

import LayerVisibilityToggle from "./LayerVisibilityToggle";

const StyledPanelContent = styled.div`
  background-color: ${(props) => props.theme.sidePanelBg};
  width: 100%;
  height: 100%;
  color: ${(props) => props.theme.textColor};
`;

const LayerGroupContainer = styled.div`
  background-color: ${(props) => props.theme.sidePanelHeaderBg};
  color: ${(props) => props.theme.textColor};
  width: 100%;
  padding: 6px;
  margin-bottom: 8px;
`;

const LayerManagerPanel = () => {
  return (
    <div>
      <StyledPanelContent>
        <LayerGroupContainer>
          <div className="px ml-1 mb-2">
            <b>Points</b>
          </div>
          <LayerVisibilityToggle layerName={"Vessels"} />
        </LayerGroupContainer>
        <LayerGroupContainer>
          <div className="px ml-1 mb-2">
            <b>Paths</b>
          </div>
          <LayerVisibilityToggle layerName={"Historical Path"} />
          <LayerVisibilityToggle layerName={"Future Path"} />
        </LayerGroupContainer>
        <LayerGroupContainer>
          <div className="px ml-1 mb-2">
            <b>Zones</b>
          </div>
          <LayerVisibilityToggle layerName={"Mooring Areas"} />
          <LayerVisibilityToggle layerName={"Anchorage Areas"} />
          <LayerVisibilityToggle layerName={"Collision Risk Heatmap"} />
          <LayerVisibilityToggle layerName={"Collision Risk Hexagon Grid"} />
          <LayerVisibilityToggle layerName={"Collision Risk Screen Grid"} />
        </LayerGroupContainer>
      </StyledPanelContent>
    </div>
  );
};

export default LayerManagerPanel;
