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
import data_vessels from "data/data_vessels.json";

const App = () => {
  const darkThemeEnabled = useSelector((state) => state.darkThemeEnabled);
  return (
    <div>
      <StylesProvider injectFirst>
        <ThemeProvider theme={darkThemeEnabled ? darkTheme : lightTheme}>
          <GlobalStyle />

          <div className="h-screen w-screen flex justify-between overflow-hidden">
            <SidePanel />
            <div className="h-full w-full flex-1">
              <div className="h-full flex flex-col-reverse space-y-reverse">
                <TimeSlider />
              </div>
            </div>
            <DetailsPanel data={data_vessels} />
          </div>

          <MapContainer
            mapStyle={
              darkThemeEnabled ? darkTheme.mapStyle : lightTheme.mapStyle
            }
            data={data_vessels}
          />
        </ThemeProvider>
      </StylesProvider>
    </div>
  );
};

export default App;
