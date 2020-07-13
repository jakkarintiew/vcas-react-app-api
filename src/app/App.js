import React, { useState, useEffect } from "react";
import axios from "axios";
import { ThemeProvider } from "styled-components";
import { StylesProvider } from "@material-ui/styles";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

import { useSelector, useDispatch } from "react-redux";

import { lightTheme, darkTheme } from "styles/themes";
import { GlobalStyle } from "styles/global";

import MapContainer from "components/map/MapContainer";
import SidePanel from "components/control-panel/ControlPanel";
import DetailsPanel from "components/details-panel/DetailsPanel";
import TimeSlider from "components/time-slider/TimeSlider";

import {
  setMetadataActionCreator,
  // setLoadedFramesActionCreator,
  incrementLoadedFramesActionCreator,
} from "app/Redux";

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
  const activeVesselID = useSelector((state) => state.activeVesselID);
  const setMetadata = (metadata) => {
    dispatch(setMetadataActionCreator(metadata));
  };
  // const setLoadedFrames = (framesLength) => {
  //   dispatch(setLoadedFramesActionCreator(framesLength));
  // };
  const incrementLoadedFrames = () => {
    dispatch(incrementLoadedFramesActionCreator());
  };

  const [vesselsData, setVesselsData] = useState([]);
  const [frames, setFrames] = useState({});
  const [activeVesselsData, setActiveVesselsData] = useState([]);
  const [error, setError] = useState(null);
  const [pathData, setPathData] = useState([]);
  const pathDataInitialState = [
    {
      path: [],
      timestamps: [],
      speed: [],
      heading: [],
      course: [],
      risk: [],
    },
  ];
  const [futurePathData, setFuturePathData] = useState(pathDataInitialState);
  const [historicalPathData, setHistoricalPathData] = useState(
    pathDataInitialState
  );
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
        setVesselsData(firstFrame.data);
        setMetadata(metadata.data);
      } catch (error) {
        setError(error);
      }
    };
    getFirstFrame();
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
    setVesselsData(frames[currentFrame]);
    if (activeVesselID) {
      const newActiveVessel = frames[currentFrame].filter((vessel) => {
        return vessel.mmsi === activeVesselID;
      });
      setActiveVesselsData(newActiveVessel);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFrame]);

  // When active vessel is updated, load path data and frames
  useEffect(() => {
    if (vesselsData && activeVesselID) {
      setActiveVesselsData(
        vesselsData.filter((vessel) => {
          return vessel.mmsi === activeVesselID;
        })
      );

      const getPathData = async () => {
        try {
          const path = await axios.get(
            FRAMES_DIR + `paths_new/${activeVesselID}_path.json`
          );
          setPathData(path.data);
        } catch (error) {
          console.log(error);
        }
      };
      getPathData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeVesselID]);

  useEffect(() => {
    let currentIndex = pathData.findIndex((obj) => obj.frame === currentFrame);
    let filteredPath;
    if (
      pathData.length > 0 &&
      currentFrame <= pathData[pathData.length - 1].frame &&
      currentFrame >= pathData[0].frame &&
      currentIndex !== -1
    ) {
      for (let index = currentIndex; index <= pathData.length - 1; index++) {
        if (currentIndex === pathData.length - 1) {
          setFuturePathData(pathDataInitialState);
          break;
        } else if (
          index === pathData.length - 1 ||
          pathData[index + 1].frame - pathData[index].frame > 1
        ) {
          filteredPath = pathData.filter((elem) => {
            return (
              elem.frame >= currentFrame && elem.frame <= pathData[index].frame
            );
          });
          setFuturePathData([
            {
              path: filteredPath.map((frame) => [
                frame.longitude,
                frame.latitude,
              ]),
              timestamps: filteredPath.map((frame) => frame.timestamp),
              speed: filteredPath.map((frame) => frame.speed),
              heading: filteredPath.map((frame) => frame.heading),
              course: filteredPath.map((frame) => frame.course),
              risk: filteredPath.map((frame) => frame.risk),
            },
          ]);
          break;
        }
      }

      for (let index = currentIndex; index >= 0; index--) {
        if (currentIndex === 0) {
          setHistoricalPathData(pathDataInitialState);
          break;
        } else if (
          index === 0 ||
          pathData[index].frame - pathData[index - 1].frame > 1
        ) {
          filteredPath = pathData.filter((elem) => {
            return (
              elem.frame >= pathData[index].frame && elem.frame <= currentFrame
            );
          });
          setHistoricalPathData([
            {
              path: filteredPath.map((frame) => [
                frame.longitude,
                frame.latitude,
              ]),
              timestamps: filteredPath.map((frame) => frame.timestamp),
              speed: filteredPath.map((frame) => frame.speed),
              heading: filteredPath.map((frame) => frame.heading),
              course: filteredPath.map((frame) => frame.course),
              risk: filteredPath.map((frame) => frame.risk),
            },
          ]);
          break;
        }
      }
    } else {
      setFuturePathData(pathDataInitialState);
      setHistoricalPathData(pathDataInitialState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathData, currentFrame]);

  if (error) return <div>Error: {error.message}</div>;
  if (!vesselsData || metadata.frames.length === 0)
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
            <SidePanel vesselsData={vesselsData} />
            <div className="h-full w-full flex-1">
              <TimeSlider />
            </div>
            <DetailsPanel
              vesselsData={vesselsData}
              activeVesselsData={activeVesselsData}
              historicalPathData={historicalPathData}
              futurePathData={futurePathData}
            />
          </div>

          <MapContainer
            vesselsData={vesselsData}
            activeVesselsData={activeVesselsData}
            historicalPathData={historicalPathData}
            futurePathData={futurePathData}
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
