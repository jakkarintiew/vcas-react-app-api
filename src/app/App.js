import React, { useState, useEffect } from "react";
import axios from "axios";
import { StylesProvider } from "@material-ui/styles";
import { ThemeProvider } from "styled-components";
import { useSelector, useDispatch } from "react-redux";

import { lightTheme, darkTheme } from "styles/themes";
import { GlobalStyle } from "styles/global";

import MapContainer from "components/Map/MapContainer";
import SidePanel from "components/SidePanel/SidePanel";
import DetailsPanel from "components/DetailsPanel/DetailsPanel";
import TimeSlider from "components/TimeSlider/TimeSlider";

import {
  setMetadataActionCreator,
  setLoadedFramesActionCreator,
} from "app/redux";

const METADATA_PATH =
  "https://raw.githubusercontent.com/jakkarintiew/frames-data/master/frames_20s/frames_metadata.json";
const FRAMES_DIR =
  "https://raw.githubusercontent.com/jakkarintiew/frames-data/master/frames_20s/";

const App = () => {
  // Redux states
  const dispatch = useDispatch();
  const darkThemeEnabled = useSelector((state) => state.darkThemeEnabled);
  const metadata = useSelector((state) => state.frames.metadata);
  const currentFrame = useSelector((state) => state.frames.currentFrame);
  // const loadedFrames = useSelector((state) => state.frames.loadedFrames);

  // const setCurrentFrame = (frame) => {
  //   dispatch(setCurrentFrameActionCreator(frame));
  // };

  const [data, setData] = useState([]);
  const [frames, setFrames] = useState({});
  const [error, setError] = useState(null);

  // Load first frame + metadata; ran once
  useEffect(() => {
    const setMetadata = (metadata) => {
      dispatch(setMetadataActionCreator(metadata));
    };
    const getFirstFrame = async () => {
      try {
        const promiseFrame = axios.get(FRAMES_DIR + `${0}_frame.json`);
        const promiseMetadata = axios.get(METADATA_PATH);
        const [firstFrame, metadata] = await Promise.all([
          promiseFrame,
          promiseMetadata,
        ]);
        setFrames((prevFrames) => ({ ...prevFrames, 0: firstFrame.data }));
        setData(firstFrame.data);
        setMetadata(metadata.data);
      } catch (error) {
        setError(error);
      }
    };
    getFirstFrame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Once metadata loaded, load remaining frames
  useEffect(() => {
    const getFrame = async (index) => {
      const promiseFrame = await axios.get(FRAMES_DIR + `${index}_frame.json`);
      console.log(index);
      setFrames((prevFrames) => ({
        ...prevFrames,
        [index]: promiseFrame.data,
      }));
    };

    const getRemainingFrames = () => {
      const totalFrames = metadata.frames.length;
      const promiseFrames = [];
      for (let index = 1; index < totalFrames; index++) {
        promiseFrames.push(getFrame(index));
      }
      Promise.all(promiseFrames);
    };

    if (metadata.frames.length) {
      getRemainingFrames();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metadata]);

  // When frames are updated, update progress
  useEffect(() => {
    const setLoadedFrames = (framesLength) => {
      dispatch(setLoadedFramesActionCreator(framesLength));
    };
    if (Object.keys(frames).length > 0) {
      setLoadedFrames(Object.keys(frames).length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frames]);

  // When current frame is updated, update data
  useEffect(() => {
    setData(frames[currentFrame]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFrame]);

  if (error) return <div>Error: {error.message}</div>;
  if (!data || metadata.frames.length === 0) return <div>Loading...</div>;
  else {
    return (
      <div>
        <StylesProvider injectFirst>
          <ThemeProvider theme={darkThemeEnabled ? darkTheme : lightTheme}>
            <GlobalStyle />

            <div className="h-screen w-screen flex justify-between overflow-hidden">
              <SidePanel data={data} />
              <div className="h-full w-full flex-1">
                <TimeSlider />
              </div>
              <DetailsPanel data={data} />
            </div>

            <MapContainer
              data={data}
              mapStyle={
                darkThemeEnabled ? darkTheme.mapStyle : lightTheme.mapStyle
              }
            />
          </ThemeProvider>
        </StylesProvider>
      </div>
    );
  }
};

export default App;
