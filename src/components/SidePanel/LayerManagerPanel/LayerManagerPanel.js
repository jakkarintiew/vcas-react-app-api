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
        <LayerVisibilityCheckBox name={"Collision Risk Screen Grid"} />
        <LayerVisibilityCheckBox name={"Collision Risk Hexagon Grid"} />
        <LayerVisibilityCheckBox name={"Historical Path"} />
        <LayerVisibilityCheckBox name={"Future Path"} />
        <LayerVisibilityCheckBox name={"Historical Trip"} />
        <LayerVisibilityCheckBox name={"Future Trip"} />
        <LayerVisibilityCheckBox name={"Vessels"} />
      </StyledPanelContent>
    </div>
  );
};

export default LayerManagerPanel;
