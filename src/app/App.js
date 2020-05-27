import React, { useState } from "react";
import { StylesProvider } from "@material-ui/styles";
import { ThemeProvider } from "styled-components";
import MapContainer from "../components/MapContainer";
import SidePanel from "../components/SidePanel";

import { lightTheme, theme as darkTheme } from "../styles/themes";
import { GlobalStyle } from "../styles/global";

const App = () => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return (
    <div>
      <StylesProvider injectFirst>
        <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
          <GlobalStyle />
          <button onClick={toggleTheme}>Toggle theme</button>
          <SidePanel />
          <MapContainer />
        </ThemeProvider>
      </StylesProvider>
    </div>
  );
};

export default App;
