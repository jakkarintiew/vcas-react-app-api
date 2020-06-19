import React from "react";
import { StylesProvider } from "@material-ui/styles";
import { ThemeProvider } from "styled-components";
import { useSelector } from "react-redux";

import { lightTheme, darkTheme } from "styles/themes";
import { GlobalStyle } from "styles/global";

import MapContainer from "components/Map/MapContainer";
import SidePanel from "components/SidePanel/SidePanel";
import DetailsPanel from "components/DetailsPanel/DetailsPanel";
import TimeSlider from "components/TimeSlider/TimeSlider";

// import vesselData from "data/data_vessels.json";

const App = () => {
  // Redux states
  const darkThemeEnabled = useSelector((state) => state.darkThemeEnabled);

  return (
    <div>
      <StylesProvider injectFirst>
        <ThemeProvider theme={darkThemeEnabled ? darkTheme : lightTheme}>
          <GlobalStyle />

          <div className="h-screen w-screen flex justify-between overflow-hidden">
            <SidePanel />
            <div className="h-full w-full flex-1">
              <TimeSlider />
            </div>
            <DetailsPanel />
          </div>

          <MapContainer
            mapStyle={
              darkThemeEnabled ? darkTheme.mapStyle : lightTheme.mapStyle
            }
          />
        </ThemeProvider>
      </StylesProvider>
    </div>
  );
};

export default App;
