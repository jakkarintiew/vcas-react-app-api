import React from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { togglePanelOpenActionCreator } from "app/redux";

import VesselDetails from "./VesselDetails";
import CollapseButton from "components/common/CollapseButton";
import ArrowRight from "components/common/icons/arrow-right";

const StyledDetailsPanelContainer = styled.div`
  z-index: 99;
  height: 100%;
  width: ${(props) => props.width + 2 * props.theme.sidePanel.margin.left}px;
  display: flex;
  position: absolute;
  padding-top: ${(props) => props.theme.sidePanel.margin.top}px;
  padding-right: ${(props) => props.theme.sidePanel.margin.left}px;
  padding-bottom: ${(props) => props.theme.sidePanel.margin.bottom}px;
  padding-left: ${(props) => props.theme.sidePanel.margin.right}px;
  transition: ${(props) => props.theme.transition};
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
  // Redux states
  const dispatch = useDispatch();
  const panelOpen = useSelector((state) => state.panelOpen);
  const togglePanelOpen = (panelKey) => {
    dispatch(togglePanelOpenActionCreator(panelKey));
  };

  // Component constants
  const initialDegree = 0;
  const width = 300;
  const panelKey = "detailsPanel";
  const panel =
    panelOpen[Object.keys(panelOpen).find((key) => key === panelKey)];

  const handleOnClick = (event) => {
    togglePanelOpen(panelKey);
  };
  return (
    <div className="flex flex-row-reverse space-x-reverse">
      <StyledDetailsPanelContainer width={panel.isOpen ? width : 0}>
        {panel.isOpen && (
          <DetailsPanelInner>
            <VesselDetails data={props.data} />
          </DetailsPanelInner>
        )}
        <CollapseButton onClick={handleOnClick} style={{ left: "-5px" }}>
          <ArrowRight
            height="12px"
            style={{
              transform: `rotate(${
                panel.isOpen ? initialDegree : initialDegree + 180
              }deg)`,
            }}
          />
        </CollapseButton>
      </StyledDetailsPanelContainer>
    </div>
  );
};

export default DetailsPanel;
