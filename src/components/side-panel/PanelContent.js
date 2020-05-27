import React from "react";
import styled from "styled-components";

import PropTypes from "prop-types";
import { useTheme } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import StorageIcon from "@material-ui/icons/Storage";
import LayersIcon from "@material-ui/icons/Layers";
import EditLocationIcon from "@material-ui/icons/EditLocation";

const StyledTabsContainer = styled.div`
  background-color: ${(props) => props.theme.sidePanelHeaderBg};
  flex-grow: 1,
  width: "100%",
`;

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

// const tabStyles = (theme) => {
//   return {
//     root: {
//       color: theme.activeColor,
//       textTransform: "none",
//       fontWeight: 150,
//       "&:focus": {
//         opacity: 1,
//       },
//       minWidth: "auto",
//       width: 100,
//       minHeight: "auto",
//       height: 35,
//       padding: 0,
//     },
//   };
// };

// const StyledTab = withStyles(tabStyles)((props) => (
//   <Tab disableRipple {...props} />
// ));

const StyledTab = styled(Tab)`
  transition: ${(props) => props.theme.transition};
  text-transform: none;
  font-weight: 150;
  color: ${(props) => props.theme.textColor};
  font-size: ${(props) => props.theme.fontSize};
  :focus {
    opacity: 1;
    color: ${(props) => props.theme.activeColor};
  }
  :hover {
    opacity: 1;
    color: ${(props) => props.theme.activeColor};
  }
  min-width: auto;
  width: 100px;
  min-height: auto;
  height: 35px;
  padding: 0;
`;

export const panels = [
  {
    id: "data",
    label: "Data",
    iconComponent: StorageIcon,
  },
  {
    id: "layer",
    label: "Layer",
    iconComponent: LayersIcon,
  },
  {
    id: "map",
    label: "Map",
    iconComponent: EditLocationIcon,
  },
];

const PanelContent = () => {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div>
      <StyledTabsContainer position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          style={{
            minHeight: "auto",
            height: 35,
            backgroundColor: theme.sidePanelHeaderBg,
          }}
        >
          {panels.map((panel) => (
            <StyledTab
              disableRipple
              style={{
                color: theme.activeColor,
              }}
              label={
                <div>
                  <panel.iconComponent
                    style={{
                      verticalAlign: "middle",
                      fontSize: 18,
                    }}
                  />{" "}
                  {panel.label}
                </div>
              }
            />
          ))}
        </Tabs>
      </StyledTabsContainer>

      <TabPanel value={value} index={0}>
        Data manager here
      </TabPanel>
      <TabPanel value={value} index={1}>
        Map layers manager here
      </TabPanel>
      <TabPanel value={value} index={2}>
        Map style settings <here></here>
      </TabPanel>
    </div>
  );
};

export default PanelContent;
