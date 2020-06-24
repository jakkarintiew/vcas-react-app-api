import React, { useState, useEffect } from "react";
// import useSWR from "swr";
// import fetch from "unfetch";

import { StylesProvider } from "@material-ui/styles";
import { ThemeProvider } from "styled-components";
import { useSelector } from "react-redux";

import { lightTheme, darkTheme } from "styles/themes";
import { GlobalStyle } from "styles/global";

import MapContainer from "components/Map/MapContainer";
import SidePanel from "components/SidePanel/SidePanel";
import DetailsPanel from "components/DetailsPanel/DetailsPanel";
import TimeSlider from "components/TimeSlider/TimeSlider";

import DataLoader from "./DataLoader";

// const MAX_FRAMES = 120;
// const METADATA_PATH =
//   "https://raw.githubusercontent.com/jakkarintiew/frames-data/master/frames_20s/frames_metadata.json";
// const FRAMES_DIR =
//   "https://raw.githubusercontent.com/jakkarintiew/frames-data/master/frames_20s/";

const App = () => {
  // Redux states
  const darkThemeEnabled = useSelector((state) => state.darkThemeEnabled);
  const currentFrame = useSelector((state) => state.currentFrame);

  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [frames, setFrames] = useState({});

  // const fetcher = (url) => fetch(url).then((r) => r.json());
  // const { data, error } = useSWR(
  //   FRAMES_DIR + `${currentFrame}_frame.json`,
  //   fetcher
  // );

  // const loadRemainingFrames = async () => {
  //   for (let i = 0; i < MAX_FRAMES; i++) {
  //     const response = fetch(FRAMES_DIR + `${i}_frame.json`)
  //       .then((response) => response.json())
  //       .then((data) => setFrames(...frames, { [i]: data }));
  //     console.log(frames);
  //   }
  // };

  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    const dataLoader = new DataLoader();
    dataLoader.loadFrame(0).then(
      (data) => {
        setData(data);
        console.log("Loading remaining frames...");
        dataLoader.connect(runAfterConnect);
      },
      (error) => {
        setError(error);
      }
    );
  }, []);

  function runAfterConnect(loadedFrames) {
    console.log("Running callback");
    setFrames(loadedFrames);
  }

  useEffect(() => {
    setData(frames[currentFrame]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFrame]);

  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>Loading...</div>;
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
