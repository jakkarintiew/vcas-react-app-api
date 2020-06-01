import React from "react";
import { StylesProvider } from "@material-ui/styles";
import { ThemeProvider } from "styled-components";
import { useSelector } from "react-redux";
import { LightTheme, BaseProvider } from "baseui";
import { Provider as StyletronProvider } from "styletron-react";
import { Client as Styletron } from "styletron-engine-atomic";

import { lightTheme, darkTheme } from "styles/themes";
import { GlobalStyle } from "styles/global";

import MapContainer from "components/Map/MapContainer";
import SidePanel from "components/SidePanel/SidePanel";

import data_vessels from "data/data_vessels.json";

const App = () => {
  const darkThemeEnabled = useSelector((state) => state.darkThemeEnabled);
  return (
    <div>
      <StyletronProvider value={new Styletron()}>
        <BaseProvider theme={LightTheme}>
          <StylesProvider injectFirst>
            <ThemeProvider theme={darkThemeEnabled ? darkTheme : lightTheme}>
              <GlobalStyle />
              <SidePanel />
              <MapContainer
                mapStyle={
                  darkThemeEnabled ? darkTheme.mapStyle : lightTheme.mapStyle
                }
                data={data_vessels}
              />
            </ThemeProvider>
          </StylesProvider>
        </BaseProvider>
      </StyletronProvider>
    </div>
  );
};

export default App;
