import React from "react";
import styled from "styled-components";

const StyledPanelContent = styled.div`
  transition: ${(props) => props.theme.transition};
  background-color: ${(props) => props.theme.sidePanelBg};
  width: 100%;
  height: 100%;
  color: ${(props) => props.theme.textColor};
`;

const DataManagerPanel = () => {
  return (
    <div>
      <StyledPanelContent> Data Manager here </StyledPanelContent>
    </div>
  );
};

export default DataManagerPanel;
