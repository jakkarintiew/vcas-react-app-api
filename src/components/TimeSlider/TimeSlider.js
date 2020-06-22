import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import styled from "styled-components";
import { withStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";
import IconButton from "@material-ui/core/IconButton";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import PauseCircleFilledIcon from "@material-ui/icons/PauseCircleFilled";

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
  align-items: stretch;
  box-shadow: ${(props) => props.theme.panelBoxShadow};
  background-color: ${(props) => props.theme.sidePanelBg};
  height: 100%;
  width: 100%;
`;

const StyledIconButton = styled(IconButton)`
  color: ${(props) => props.theme.textColor};
  opacity: 0.6;
  border: none;
  :focus {
    outline: 0;
  }
  :hover {
    opacity: 1;
  }
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

  const totalFrames = 30;
  const handleOnClick = (event) => {
    togglePanelOpen(panelKey);
  };

  const [sliderValue, setSliderValue] = useState(currentFrame);
  const handleSliderChange = (event, value) => {
    setSliderValue(value);
    setCurrentFrame(value);
  };

  const [playing, setPlaying] = useState(false);
  const togglePlayPause = (event) => {
    setPlaying(!playing);
  };

  useEffect(() => {
    let interval = null;
    const timePerFrame = 100; // ms
    if (playing) {
      interval = setInterval(() => {
        if (sliderValue === totalFrames - 1) {
          setSliderValue(0);
          setCurrentFrame(0);
        } else {
          setSliderValue((sliderValue) => sliderValue + 1);
          setCurrentFrame(sliderValue);
        }
      }, timePerFrame);
    } else if (!playing && sliderValue !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, sliderValue]);

  return (
    <BottomPanelBox className="h-full flex flex-col-reverse space-y-reverse">
      <StyledTimeSliderContainer height={panel.isOpen ? height : 0}>
        {panel.isOpen && (
          <TimeSliderInner>
            <div className="items-center flex flex-row p-2">
              <StyledIconButton onClick={togglePlayPause}>
                {playing ? <PauseCircleFilledIcon /> : <PlayCircleFilledIcon />}
              </StyledIconButton>
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
