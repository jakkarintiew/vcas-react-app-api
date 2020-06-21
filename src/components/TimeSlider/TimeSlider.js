import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import styled from "styled-components";
import { withStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";

import {
  togglePanelOpenActionCreator,
  setCurrentFrameActionCreator,
} from "app/redux";
import CollapseButton from "components/common/CollapseButton";
import ArrowRight from "components/common/icons/arrow-right";

const BottomPanelBox = styled.div`
  width: 100%;
  height: ${(props) => props.height + 2 * props.theme.sidePanel.margin.top}px;
  position: relative;
`;

const StyledTimeSliderContainer = styled.div`
  z-index: 99;
  bottom: 5px;
  height: ${(props) => props.height + 2 * props.theme.sidePanel.margin.top}px;
  max-width: 100%;
  display: flex;
  position: relative;
  padding-top: ${(props) => props.theme.sidePanel.margin.top}px;
  padding-right: 0px;
  padding-bottom: ${(props) => props.theme.sidePanel.margin.bottom}px;
  padding-left: 0px;
  transition: ${(props) => props.theme.transitionFast};
`;

const TimeSliderInner = styled.div`
  box-shadow: ${(props) => props.theme.panelBoxShadow};
  align-items: stretch;
  background-color: ${(props) => props.theme.sidePanelBg};
  border-radius: 5px;
  height: 100%;
  width: 100%;
`;

const StyledSlider = withStyles({
  root: {
    color: "#00d672",
    height: 8,
  },
  thumb: {
    height: 16,
    width: 16,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    marginTop: -4,
    // marginLeft: -6,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
  },
  active: {},
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#c9c9c9",
  },
})(Slider);

const TimeSlider = () => {
  // Redux states
  const dispatch = useDispatch();
  const panelOpen = useSelector((state) => state.panelOpen);

  const togglePanelOpen = (panelKey) => {
    dispatch(togglePanelOpenActionCreator(panelKey));
  };
  const currentFrame = useSelector((state) => state.currentFrame);
  const setCurrentFrame = (frame) => {
    dispatch(setCurrentFrameActionCreator(frame));
  };

  // Component constants
  const initialDegree = 90;
  const height = 100;
  const panelKey = "timeSlider";
  const panel =
    panelOpen[Object.keys(panelOpen).find((key) => key === panelKey)];

  const totalFrames = 120;
  const handleOnClick = (event) => {
    togglePanelOpen(panelKey);
  };

  const [sliderValue, setSliderValue] = useState(currentFrame);
  const handleSliderChange = (event, value) => {
    setSliderValue(value);
    setCurrentFrame(value);
  };

  return (
    <BottomPanelBox className="h-full flex flex-col-reverse space-y-reverse">
      <StyledTimeSliderContainer height={panel.isOpen ? height : 0}>
        {panel.isOpen && (
          <TimeSliderInner>
            <div className="px-10">
              <StyledSlider
                value={sliderValue}
                min={0}
                max={totalFrames - 1}
                onChange={handleSliderChange}
                valueLabelDisplay="auto"
              />
            </div>
          </TimeSliderInner>
        )}
        <CollapseButton onClick={handleOnClick} style={{ top: "-5px" }}>
          <ArrowRight
            height="12px"
            style={{
              transform: `rotate(${
                panel.isOpen ? initialDegree : initialDegree + 180
              }deg)`,
            }}
          />
        </CollapseButton>
      </StyledTimeSliderContainer>
    </BottomPanelBox>
  );
};

export default TimeSlider;
