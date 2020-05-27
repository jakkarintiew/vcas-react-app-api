import React from "react";
import styled from "styled-components";

const StyledSidePanelContainer = styled.div`
  z-index: 50;
  height: 93%;
  width: ${(props) =>
    props.theme.sidePanel.width + 2 * props.theme.sidePanel.margin.left}px;
  display: flex;
  transition: width 250ms;
  position: absolute;
  padding-top: ${(props) => props.theme.sidePanel.margin.top}px;
  padding-right: ${(props) => props.theme.sidePanel.margin.right}px;
  padding-bottom: ${(props) => props.theme.sidePanel.margin.bottom}px;
  padding-left: ${(props) => props.theme.sidePanel.margin.left}px;
`;

const SideBarInner = styled.div`
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
  align-items: stretch;
  background-color: ${(props) => props.theme.sidePanelBg};
  border-radius: 5px;
  height: 100%;
  width: ${(props) => props.theme.sidePanel.width}px;
`;

const SideBar = (props) => {
  return (
    <StyledSidePanelContainer>
      <SideBarInner>{props.children}</SideBarInner>
    </StyledSidePanelContainer>
  );
};

export default SideBar;
