import React, { useState, useEffect } from "react";
import axios from "axios";

import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { togglePanelOpenActionCreator } from "app/redux";

import VesselDetails from "./VesselDetails";
import CollapseButton from "components/common/CollapseButton";
import ArrowRight from "components/common/icons/arrow-right";

const FRAMES_DIR =
  "https://raw.githubusercontent.com/jakkarintiew/frames-data/master/frames_20s/";

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
  height: 100%;
  width: ${(props) => props.theme.sidePanel.width}px;
`;

const PlaceholderContainer = styled.div`
  background-color: ${(props) => props.theme.sidePanelBg};
  color: ${(props) => props.theme.textColor};
  font-size: 1.2em;
  text-align: center;
  padding: 10px;
`;

const DetailsPanel = ({ data }) => {
  // Redux states
  const dispatch = useDispatch();
  const panelOpen = useSelector((state) => state.panelOpen);
  const activeVesselID = useSelector((state) => state.activeVesselID);
  const activeVessel = data.filter((vessel) => {
    return vessel.mmsi === activeVesselID;
  });

  const togglePanelOpen = (panelKey) => {
    dispatch(togglePanelOpenActionCreator(panelKey));
  };

  const [pathData, setPathData] = useState([]);
  useEffect(() => {
    const getPathData = async () => {
      const path = await axios.get(
        FRAMES_DIR + `paths/${activeVesselID}/0_frame_${activeVesselID}.json`
      );
      setPathData(path.data);
    };
    if (activeVesselID) {
      getPathData();
      console.log(activeVesselID);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeVesselID]);

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
            {pathData.length > 0 ? (
              <VesselDetails
                activeVessel={activeVessel[0]}
                pathData={pathData[0]}
              />
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
