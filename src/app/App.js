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
  const activeVesselID = useSelector((state) => state.activeVesselID);

  const [vesselsData, setVesselsData] = useState([]);
  const [frames, setFrames] = useState({});
  const [activeVesselsData, setActiveVesselsData] = useState([]);
  const [pathData, setPathData] = useState([]);
  const [pathFrames, setPathFrames] = useState([]);
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
        setFrames((prevFrames) => ({
          ...prevFrames,
          [index]: promiseFrame.data,
        }));
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
    setVesselsData(frames[currentFrame]);
    if (activeVesselID) {
      setPathData(pathFrames[currentFrame]);
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
      setPathData([]);
      setPathFrames([]);
      setActiveVesselsData(
        vesselsData.filter((vessel) => {
          return vessel.mmsi === activeVesselID;
        })
      );

      const getFirstPathFrames = async () => {
        try {
          const firstPathFrame = await axios.get(
            FRAMES_DIR +
              `paths/${activeVesselID}/${currentFrame}_frame_${activeVesselID}.json`
          );
          setPathData(firstPathFrame.data);
          setPathFrames((prevFrames) => ({
            ...prevFrames,
            [currentFrame]: firstPathFrame.data,
          }));
        } catch (error) {
          console.log(error);
        }
      };
      getFirstPathFrames();
      const getPathFrame = async (index) => {
        try {
          const promiseFrame = await axios.get(
            FRAMES_DIR +
              `paths/${activeVesselID}/${index}_frame_${activeVesselID}.json`
          );
          setPathFrames((prevFrames) => ({
            ...prevFrames,
            [index]: promiseFrame.data,
          }));
        } catch {
          // do nothing
        }
      };
      const getRemainingPathFrames = async () => {
        const promiseFrames = [];
        const totalFrames = metadata.frames.length;

        // search ahead
        for (let index = currentFrame + 1; index < totalFrames; index++) {
          promiseFrames.push(getPathFrame(index));
        }

        // search back
        for (let index = currentFrame - 1; index >= 0; index--) {
          promiseFrames.push(getPathFrame(index));
        }

        Promise.all(promiseFrames.map((p) => p.catch((error) => null)));
      };
      getRemainingPathFrames();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeVesselID]);

  if (error) return <div>Error: {error.message}</div>;
  if (!vesselsData || metadata.frames.length === 0)
    return <div>Loading...</div>;
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
              pathData={pathData}
            />
          </div>

          <MapContainer
            vesselsData={vesselsData}
            activeVesselsData={activeVesselsData}
            pathData={pathData}
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
