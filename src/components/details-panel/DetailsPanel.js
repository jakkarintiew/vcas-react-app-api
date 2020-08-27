import React from "react";

import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { togglePanelOpenActionCreator } from "app/Redux";

import VesselDetails from "./VesselDetails";
import AlertDetails from "./AlertDetails";
import CollapseButton from "components/common/CollapseButton";
import ArrowRight from "components/common/icons/arrow-right";

const RightPanelBox = styled.div`
  height: 100%;
  width: ${(props) =>
    props.theme.sidePanel.width + 2 * props.theme.sidePanel.margin.left}px;
  position: relative;
`;

const StyledDetailsPanelContainer = styled.div`
  z-index: 99;
  height: 100%;
  width: ${(props) => props.width + 2 * props.theme.sidePanel.margin.left}px;
  display: flex;
  position: relative;
  padding-top: ${(props) => props.theme.sidePanel.margin.top}px;
  padding-right: ${(props) => props.theme.sidePanel.margin.left}px;
  padding-bottom: ${(props) => props.theme.sidePanel.margin.bottom}px;
  padding-left: ${(props) => props.theme.sidePanel.margin.right}px;
  transition: ${(props) => props.theme.transitionFast};
`;

const DetailsPanelInner = styled.div`
  box-shadow: ${(props) => props.theme.panelBoxShadow};
  align-items: stretch;
  background-color: ${(props) => props.theme.sidePanelBg};
  border-radius: 5px;
  max-height: 100%;
  width: ${(props) => props.theme.sidePanel.width}px;
`;

const PlaceholderContainer = styled.div`
  background-color: ${(props) => props.theme.sidePanelBg};
  color: ${(props) => props.theme.textColor};
  font-size: 1.2em;
  text-align: center;
  padding: 10px;
`;

const DetailsPanel = ({ vesselsData }) => {
  // Redux states
  const dispatch = useDispatch();
  const panelOpen = useSelector((state) => state.panelOpen);
  const activeVessels = useSelector(
    (state) => state.vesselData.activeVesselData
  );
  const alertVessels = useSelector((state) => state.vesselData.alertVesselData);
  const activeFuturePathData = useSelector(
    (state) => state.pathData.activeFuturePathData
  );
  const activeHistoricalPathData = useSelector(
    (state) => state.pathData.activeHistoricalPathData
  );

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
    <RightPanelBox className="flex flex-row-reverse space-x-reverse">
      <StyledDetailsPanelContainer width={panel.isOpen ? width : 0}>
        {panel.isOpen && (
          <DetailsPanelInner>
            {activeVessels.length > 0 &&
            (activeHistoricalPathData.length > 0 ||
              activeFuturePathData.length > 0) ? (
              <VesselDetails
                vessel={activeVessels[0]}
                historicalPathData={activeHistoricalPathData[0]}
                futurePathData={activeFuturePathData[0]}
              />
            ) : alertVessels.length > 0 ? (
              <AlertDetails alertVessels={alertVessels}></AlertDetails>
            ) : (
              <div className="flex content-center flex-wrap flex-auto h-full p-5">
                <PlaceholderContainer className="flex-auto">
                  No active vessel selected
                </PlaceholderContainer>
              </div>
            )}
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
    </RightPanelBox>
  );
};

export default DetailsPanel;
