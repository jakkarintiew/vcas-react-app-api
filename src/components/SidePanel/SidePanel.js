import React from "react";
import styled from "styled-components";

import PanelHeader from "./PanelHeader";
import PanelContent from "./PanelContent";

const StyledSidePanelContainer = styled.div`
  z-index: 99;
  height: 100%;
  width: ${(props) =>
    props.theme.sidePanel.width + 2 * props.theme.sidePanel.margin.left}px;
  display: flex;
  position: absolute;
  padding-top: ${(props) => props.theme.sidePanel.margin.top}px;
  padding-right: ${(props) => props.theme.sidePanel.margin.right}px;
  padding-bottom: ${(props) => props.theme.sidePanel.margin.bottom}px;
  padding-left: ${(props) => props.theme.sidePanel.margin.left}px;
`;

const SidePanelInner = styled.div`
  box-shadow: ${(props) => props.theme.panelBoxShadow};
  align-items: stretch;
  background-color: ${(props) => props.theme.sidePanelBg};
  border-radius: 5px;
  height: 100%;
  width: ${(props) => props.theme.sidePanel.width}px;
`;

const SidePanel = () => {
  return (
    <div>
      <StyledSidePanelContainer>
        <SidePanelInner>
          <PanelHeader />
          <PanelContent />
        </SidePanelInner>
      </StyledSidePanelContainer>
    </div>
  );
};

export default SidePanel;
