import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import styled from "styled-components";
import { withStyles } from "@material-ui/core/styles";
// import LinearProgress from "@material-ui/core/LinearProgress";

import Slider from "@material-ui/core/Slider";
import IconButton from "@material-ui/core/IconButton";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import PauseCircleFilledIcon from "@material-ui/icons/PauseCircleFilled";

import {
  togglePanelOpenActionCreator,
  setCurrentFrameActionCreator,
} from "app/Redux";
import CollapseButton from "components/common/CollapseButton";
import ArrowRight from "components/common/icons/arrow-right";

import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

const BottomPanelBox = styled.div`
  width: 100%;
  height: ${(props) =>
    props.height + 2 * props.theme.sidePanel.margin.bottom}px;
  position: relative;
`;

const StyledTimeSliderContainer = styled.div`
  z-index: 99;
  height: ${(props) =>
    props.height + 2 * props.theme.sidePanel.margin.bottom}px;
  max-width: 100%;
  display: flex;
  position: relative;
  padding-top: ${(props) => props.theme.sidePanel.margin.bottom}px;
  padding-bottom: ${(props) => props.theme.sidePanel.margin.bottom}px;
  padding-right: 0px;
  padding-left: 0px;
  transition: ${(props) => props.theme.transitionFast};
`;

const TimeSliderInner = styled.div`
  align-items: stretch;
  box-shadow: ${(props) => props.theme.panelBoxShadow};
  background-color: ${(props) => props.theme.sidePanelBg};
  height: 100%;
  width: 100%;
  border-radius: 5px;
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
  },
  rail: {
    height: 8,
    backgroundColor: "#00d672",
  },
})(Slider);

const StyledCircularProgress = withStyles({
  root: {
    color: "#00d672",
    marginTop: 10,
    animationDuration: "0ms",
  },
})(CircularProgress);

const CircularProgressWithLabel = (props) => {
  return (
    <Box
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="center"
      top={15}
    >
      <StyledCircularProgress {...props} />
      <Box
        top={10}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography
          variant="caption"
          component="div"
          color="textSecondary"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
};

const TimeSlider = () => {
  // Redux states
  const dispatch = useDispatch();
  const panelOpen = useSelector((state) => state.panelOpen);

  const togglePanelOpen = (panelKey) => {
    dispatch(togglePanelOpenActionCreator(panelKey));
  };

  const currentFrame = useSelector((state) => state.frames.currentFrame);
  const metadata = useSelector((state) => state.frames.metadata);
  const loadedFrames = useSelector((state) => state.frames.loadedFrames);

  const setCurrentFrame = (frame) => {
    dispatch(setCurrentFrameActionCreator(frame));
  };

  const [marks, setMarks] = useState([]);

  useEffect(() => {
    const convertUnix = (timestamp) => {
      var date = new Date(timestamp * 1000);
      var hours = date.getHours();
      var minutes = "0" + date.getMinutes();
      // var seconds = "0" + date.getSeconds();

      // Will display time in 10:30:23 format
      var formattedTime = hours + ":" + minutes.substr(-2);
      return formattedTime;
    };
    if (metadata.frames.length > 0) {
      const firstMarkValue = Math.floor(metadata.frames.length / 4);
      const filteredFrames = metadata.frames.filter((data) => {
        return data.frame % firstMarkValue === 0;
      });
      filteredFrames.push(metadata.frames[metadata.frames.length - 1]);
      setMarks([
        ...filteredFrames.map((frame) => ({
          value: frame.frame,
          label: convertUnix(frame.timestamp),
        })),
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const convertUnix = (timestamp) => {
    var date = new Date(timestamp * 1000);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    // var seconds = "0" + date.getSeconds();

    // Will display time in 10:30:23 format
    var formattedTime = hours + ":" + minutes.substr(-2);
    return formattedTime;
  };

  function valueLabelFormat(value) {
    const index = metadata.frames.findIndex((data) => data.frame === value);
    const valueLabel = convertUnix(metadata.frames[index].timestamp);
    return valueLabel;
  }

  // Component constants
  const initialDegree = 90;
  const height = 90;
  const panelKey = "timeSlider";
  const panel =
    panelOpen[Object.keys(panelOpen).find((key) => key === panelKey)];

  // const totalFrames = loadedFrames;
  const totalFrames = metadata.frames.length;

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
    const timePerFrame = 300; // ms
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

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress((loadedFrames / totalFrames) * 100);
  }, [loadedFrames, totalFrames]);

  return (
    <BottomPanelBox className="flex-1 flex flex-col-reverse space-y-reverse">
      <StyledTimeSliderContainer height={panel.isOpen ? height : 0}>
        {panel.isOpen && (
          <TimeSliderInner>
            {loadedFrames < totalFrames ? (
              <CircularProgressWithLabel value={progress} />
            ) : (
              <div className="items-stretch flex flex-row p-2">
                <StyledIconButton onClick={togglePlayPause}>
                  {playing ? (
                    <PauseCircleFilledIcon />
                  ) : (
                    <PlayCircleFilledIcon />
                  )}
                </StyledIconButton>

                <div className="px-5 flex-auto -mb-6">
                  <StyledSlider
                    value={sliderValue}
                    min={0}
                    max={totalFrames - 1}
                    onChange={handleSliderChange}
                    valueLabelDisplay="auto"
                    marks={marks}
                    valueLabelFormat={valueLabelFormat}
                  />
                </div>
              </div>
            )}
          </TimeSliderInner>
        )}
        <CollapseButton onClick={handleOnClick} style={{ top: "2px" }}>
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
