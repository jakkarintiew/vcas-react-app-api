import React from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { togglePanelOpenActionCreator } from "app/Redux";

import PanelHeader from "./PanelHeader";
import PanelContent from "./PanelContent";
import CollapseButton from "components/common/CollapseButton";
import ArrowRight from "components/common/icons/arrow-right";

const LeftPanelBox = styled.div`
  height: 100%;
  width: ${(props) =>
    props.theme.sidePanel.width + 2 * props.theme.sidePanel.margin.left}px;
  display: flex;
  position: relative;
`;

const StyledSidePanelContainer = styled.div`
  z-index: 99;
  height: 100%;
  width: ${(props) => props.width + 2 * props.theme.sidePanel.margin.left}px;
  display: flex;
  position: relative;
  padding-top: ${(props) => props.theme.sidePanel.margin.top}px;
  padding-right: ${(props) => props.theme.sidePanel.margin.right}px;
  padding-bottom: ${(props) => props.theme.sidePanel.margin.bottom}px;
  padding-left: ${(props) => props.theme.sidePanel.margin.left}px;
  transition: ${(props) => props.theme.transitionFast};
`;

const SidePanelInner = styled.div`
  box-shadow: ${(props) => props.theme.panelBoxShadow};
  align-items: stretch;
  background-color: ${(props) => props.theme.sidePanelBg};
  border-radius: 5px;
  height: 100%;
  width: ${(props) => props.theme.sidePanel.width}px;
`;

const SidePanel = ({ vesselsData }) => {
  // Redux states
  const dispatch = useDispatch();
  const panelOpen = useSelector((state) => state.panelOpen);
  const togglePanelOpen = (panelKey) => {
    dispatch(togglePanelOpenActionCreator(panelKey));
  };

  // Component constants
  const initialDegree = 180;
  const width = 300;
  const panelKey = "controlPanel";
  const panel =
    panelOpen[Object.keys(panelOpen).find((key) => key === panelKey)];

  const handleOnClick = (event) => {
    togglePanelOpen(panelKey);
  };

  return (
    <LeftPanelBox>
      <StyledSidePanelContainer width={panel.isOpen ? width : 0}>
        {panel.isOpen && (
          <SidePanelInner className="flex flex-col">
            <PanelHeader />
            <PanelContent vesselsData={vesselsData} />
          </SidePanelInner>
        )}
        <CollapseButton onClick={handleOnClick} style={{ right: "-5px" }}>
          <ArrowRight
            height="12px"
            style={{
              transform: `rotate(${
                panel.isOpen ? initialDegree : initialDegree + 180
              }deg)`,
            }}
          />
        </CollapseButton>
      </StyledSidePanelContainer>
    </LeftPanelBox>
  );
};

export default SidePanel;
