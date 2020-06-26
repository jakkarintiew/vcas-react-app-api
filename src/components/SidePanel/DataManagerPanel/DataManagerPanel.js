import React from "react";
import styled from "styled-components";

import VesselTypeFilter from "./VesselTypeFilter";
import VesselSliderFilters from "./VesselSliderFilters";
import DataSourceControl from "./DataSourceControl";

const StyledPanelContent = styled.div`
  background-color: ${(props) => props.theme.sidePanelBg};
  width: 100%;
  height: 100%;
  color: ${(props) => props.theme.textColor};
`;

const DataManagerPanel = ({ vesselsData }) => {
  return (
    <StyledPanelContent>
      <DataSourceControl />
      <VesselTypeFilter />
      <VesselSliderFilters vesselsData={vesselsData} />
    </StyledPanelContent>
  );
};
export default DataManagerPanel;
