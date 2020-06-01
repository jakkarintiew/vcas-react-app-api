import React from "react";
import styled from "styled-components";

const StyledPanelContent = styled.div`
  background-color: ${(props) => props.theme.sidePanelBg};
  width: 100%;
  height: 100%;
  color: ${(props) => props.theme.textColor};
`;

const LayerManagerPanel = () => {
  return (
    <div>
      <StyledPanelContent> Layer Manager here </StyledPanelContent>
    </div>
  );
};

export default LayerManagerPanel;
