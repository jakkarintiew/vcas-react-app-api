import React from "react";
import styled from "styled-components";

import VesselDetails from "./VesselDetails";

const StyledDetailsPanelContainer = styled.div`
  z-index: 99;
  height: 100%;
  width: ${(props) =>
    props.theme.sidePanel.width + 2 * props.theme.sidePanel.margin.left}px;
  display: flex;
  position: absolute;
  padding-top: ${(props) => props.theme.sidePanel.margin.top}px;
  padding-right: ${(props) => props.theme.sidePanel.margin.left}px;
  padding-bottom: ${(props) => props.theme.sidePanel.margin.bottom}px;
  padding-left: ${(props) => props.theme.sidePanel.margin.right}px;
`;

const DetailsPanelInner = styled.div`
  box-shadow: ${(props) => props.theme.panelBoxShadow};
  align-items: stretch;
  background-color: ${(props) => props.theme.sidePanelBg};
  border-radius: 5px;
  height: 100%;
  width: ${(props) => props.theme.sidePanel.width}px;
`;

const DetailsPanel = (props) => {
  return (
    <div className="flex flex-row-reverse space-x-reverse">
      <StyledDetailsPanelContainer>
        <DetailsPanelInner>
          <VesselDetails data={props.data} />
        </DetailsPanelInner>
      </StyledDetailsPanelContainer>
    </div>
  );
};

export default DetailsPanel;
