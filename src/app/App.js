import React, { useState, useEffect } from "react";
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

const App = () => {
  // Redux states
  const darkThemeEnabled = useSelector((state) => state.darkThemeEnabled);
  const currentFrame = useSelector((state) => state.currentFrame);

  const [error, setError] = useState(null);
  const [frames, setFrames] = useState([]);
  const [data, setData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    const dataLoader = new DataLoader();
    dataLoader.loadFrame(0).then(
      (data) => {
        setData(data);
        setIsLoaded(true);
        console.log("Loading remaining frames...");
        dataLoader.connect(runAfterConnect);
      },
      (error) => {
        setIsLoaded(true);
        setError(error);
      }
    );
  }, []);

  function runAfterConnect(loadedFrames) {
    setFrames(loadedFrames);
  }

  useEffect(() => {
    setData(frames[currentFrame]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFrame]);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
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
