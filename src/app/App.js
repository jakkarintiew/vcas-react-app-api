import React from "react";
import { StylesProvider } from "@material-ui/styles";
import { ThemeProvider } from "styled-components";
import { useSelector } from "react-redux";

import { lightTheme, darkTheme } from "styles/themes";
import { GlobalStyle } from "styles/global";

import MapContainer from "components/Map/MapContainer";
import SidePanel from "components/SidePanel/SidePanel";

const App = () => {
  const darkThemeEnabled = useSelector((state) => state.darkThemeEnabled);
  return (
    <div>
      <StylesProvider injectFirst>
        <ThemeProvider theme={darkThemeEnabled ? darkTheme : lightTheme}>
          <GlobalStyle />
          <SidePanel />
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
