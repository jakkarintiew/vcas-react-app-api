import React from "react";
import { StylesProvider } from "@material-ui/styles";
import { ThemeProvider } from "styled-components";
import { useSelector } from "react-redux";

import { lightTheme, darkTheme } from "styles/themes";
import { GlobalStyle } from "styles/global";

import MapContainer from "components/Map/MapContainer";
import SidePanel from "components/SidePanel/SidePanel";
import DetailsPanel from "components/DetailsPanel/DetailsPanel";

import data_vessels from "data/data_vessels.json";

const App = () => {
  const darkThemeEnabled = useSelector((state) => state.darkThemeEnabled);
  return (
    <div>
      <StylesProvider injectFirst>
        <ThemeProvider theme={darkThemeEnabled ? darkTheme : lightTheme}>
          <GlobalStyle />
          <div className="flex">
            <div className="h-full">
              <SidePanel />
            </div>
            <div className="flex-grow h-full" />
            <div className="h-full">
              <DetailsPanel data={data_vessels} />
            </div>
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
