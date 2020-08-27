import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import axios from "axios";
import { ThemeProvider } from "styled-components";
import { StylesProvider } from "@material-ui/styles";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

import { lightTheme, darkTheme } from "styles/themes";
import { GlobalStyle } from "styles/global";

import MapContainer from "components/map/MapContainer";
import ControlPanel from "components/control-panel/ControlPanel";
import DetailsPanel from "components/details-panel/DetailsPanel";
import TimeSlider from "components/time-slider/TimeSlider";
import SearchBar from "components/search-bar/SearchBar";
import {
  setMetadataActionCreator,
  setAllVesselsActionCreator,
  incrementLoadedFramesActionCreator,
} from "app/Redux";

import allCloseEncounters from "data/close_encounters.json";

const METADATA_PATH =
  "https://raw.githubusercontent.com/jakkarintiew/frames-data/master/frames_20s/frames_metadata.json";
const FRAMES_DIR =
  "https://raw.githubusercontent.com/jakkarintiew/frames-data/master/frames_20s/";

const ScreenCircularProgress = withStyles({
  indeterminate: {
    color: "#00d672",
    animationDuration: "500ms",
  },
})(CircularProgress);

const App = () => {
  // Redux states
  const dispatch = useDispatch();
  const darkThemeEnabled = useSelector((state) => state.darkThemeEnabled);
  const metadata = useSelector((state) => state.frames.metadata);
  const currentFrame = useSelector((state) => state.frames.currentFrame);
  const allVessels = useSelector((state) => state.vesselData.allVesselData);
  const alertVessels = useSelector((state) => state.vesselData.alertVesselData);

  const setMetadata = (metadata) => {
    dispatch(setMetadataActionCreator(metadata));
  };

  const setAllVessels = (vessels) => {
    dispatch(setAllVesselsActionCreator(vessels));
  };

  const incrementLoadedFrames = () => {
    dispatch(incrementLoadedFramesActionCreator());
  };

  const [frames, setFrames] = useState({});
  const [error, setError] = useState(null);
  const [alertFrame, setAlertFrame] = useState(0);
  // Load first frame + metadata; ran once at startup
  useEffect(() => {
    const getFirstFrame = async () => {
      try {
        const promiseFrame = axios.get(FRAMES_DIR + `0_frame.json`);
        const promiseMetadata = axios.get(METADATA_PATH);
        const [firstFrame, metadata] = await Promise.all([
          promiseFrame,
          promiseMetadata,
        ]);
        incrementLoadedFrames();
        setFrames((prevFrames) => ({ ...prevFrames, 0: firstFrame.data }));
        setAllVessels(firstFrame.data);
        setMetadata(metadata.data);
      } catch (error) {
        setError(error);
      }
    };
    getFirstFrame();

    // axios({
    //   method: "post",
    //   url:
    //     "https://cors-anywhere.herokuapp.com/http://52.163.54.65:80/api/v1/service/snapshot/score",
    //   data: { time_stamp_int: [1546272007] },
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${process.env.REACT_APP_SNAPSHOT_API_KEY}`,
    //   },
    // }).then((response) => console.log(response.data));

    // axios({
    //   method: "post",
    //   url:
    //     "https://cors-anywhere.herokuapp.com/http://52.163.54.65:80/api/v1/service/history/score",
    //   data: { time_stamp_int: [1546272985], mmsi: [563020440] },
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${process.env.REACT_APP_HISTORY_API_KEY}`,
    //   },
    // }).then((response) => console.log(response.data));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Once metadata loaded, load remaining vessel frames
  useEffect(() => {
    const getFrame = async (index) => {
      try {
        const promiseFrame = await axios.get(
          FRAMES_DIR + `${index}_frame.json`
        );
        incrementLoadedFrames();
        return { frameIndex: index, frameData: promiseFrame.data };
      } catch (error) {
        setError(error);
      }
    };
    const getRemainingFrames = async () => {
      await new Promise((r) => setTimeout(r, 3000));
      const totalFrames = metadata.frames.length;
      const promiseFrames = [];
      for (let index = 1; index < totalFrames; index++) {
        promiseFrames.push(getFrame(index));
      }
      Promise.all(promiseFrames)
        .then((responses) => {
          let framesData = {};
          responses.map(
            (elem) => (framesData[elem.frameIndex] = elem.frameData)
          );
          // console.log(framesData);
          setFrames((prevFrames) => ({
            ...prevFrames,
            ...framesData,
          }));
        })
        .catch((error) => setError(error));
    };
    if (metadata.frames.length) {
      getRemainingFrames();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metadata]);

  // When current frame is updated, update data
  useEffect(() => {
    setAllVessels(frames[currentFrame]);

    if (alertVessels.length === 0) {
      setAlertFrame(currentFrame >= 134 ? 179 : currentFrame + 45);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFrame]);

  if (error) return <div>Error: {error.message}</div>;
  if (!allVessels || metadata.frames.length === 0)
    return (
      <div className="flex h-screen">
        <div className="m-auto ">
          <ScreenCircularProgress />
        </div>
      </div>
    );
  else {
    return (
      <StylesProvider injectFirst>
        <ThemeProvider theme={darkThemeEnabled ? darkTheme : lightTheme}>
          <GlobalStyle />
          <div className="h-screen w-screen flex justify-between overflow-hidden">
            <ControlPanel vesselsData={allVessels} />
            <div className="h-full w-full flex flex-col flex-1">
              <SearchBar />
              <TimeSlider />
            </div>
            <DetailsPanel vesselsData={allVessels} />
          </div>

          <MapContainer
            closeEncounters={allCloseEncounters[alertFrame]}
            mapStyle={
              darkThemeEnabled ? darkTheme.mapStyle : lightTheme.mapStyle
            }
          />
        </ThemeProvider>
      </StylesProvider>
    );
  }
};

export default App;
