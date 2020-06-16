import React from "react";
import styled from "styled-components";

import VesselTypeFilter from "./VesselTypeFilter";

const StyledPanelContent = styled.div`
  background-color: ${(props) => props.theme.sidePanelBg};
  width: 100%;
  height: 100%;
  color: ${(props) => props.theme.textColor};
`;

const DataManagerPanel = () => {
  return (
    <StyledPanelContent>
      <VesselTypeFilter />
    </StyledPanelContent>
  );
};
export default DataManagerPanel;
