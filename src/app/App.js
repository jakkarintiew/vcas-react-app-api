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
import DetailsPanel from "components/DetailsPanel/DetailsPanel";

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
              <div className="flex">
                <div className="w-1/6 h-full">
                  <SidePanel />
                </div>
                <div className="w-2/3 h-full" />
                <div className="w-1/6 h-full">
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
        </BaseProvider>
      </StyletronProvider>
    </div>
  );
};

export default App;
