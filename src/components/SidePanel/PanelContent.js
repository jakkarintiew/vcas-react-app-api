import React from "react";
import styled from "styled-components";

import PropTypes from "prop-types";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import StorageIcon from "@material-ui/icons/Storage";
import LayersIcon from "@material-ui/icons/Layers";
import EditLocationIcon from "@material-ui/icons/EditLocation";

import { Scrollbars } from "react-custom-scrollbars";

import DataManagerPanel from "./DataManagerPanel/DataManagerPanel";
import LayerManagerPanel from "./LayerManagerPanel/LayerManagerPanel";
import MapManagerPanel from "./MapManagerPanel/MapManagerPanel";

const StyledTabsContainer = styled.div`
  background-color: ${(props) => props.theme.sidePanelHeaderBg};
  flex-grow: 1;
  width: 100%;
`;

const StyledTabs = styled(Tabs)`
  min-height: auto;
  height: 35;
  background-color: ${(props) => props.theme.sidePanelHeaderBg};
`;

export const panels = [
  {
    value: 0,
    id: "data",
    label: "Data",
    iconComponent: StorageIcon,
    panelComponent: DataManagerPanel,
  },
  {
    value: 1,
    id: "layer",
    label: "Layer",
    iconComponent: LayersIcon,
    panelComponent: LayerManagerPanel,
  },
  {
    value: 2,
    id: "map",
    label: "Map",
    iconComponent: EditLocationIcon,
    panelComponent: MapManagerPanel,
  },
];

const StyledTab = styled(Tab)`
  text-transform: none;
  font-size: 0.75em;
  color: ${(props) => props.theme.textColor};
  :focus {
    opacity: 1;
    color: ${(props) => props.theme.activeColor};
    background-color: ${(props) => props.theme.sidePanelBg};
    font-weight: 400;
    outline: 0;
  }
  :hover {
    opacity: 1;
    color: ${(props) => props.theme.activeColor};
  }
  min-width: auto;
  width: 70px;
  min-height: auto;
  height: 35px;
  padding: 0;
`;

const StyledPanelContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: ${(props) => props.theme.sidePanelInnerPadding}px;
`;

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <StyledPanelContainer role="tabpanel" hidden={value !== index} {...other}>
      {children}
    </StyledPanelContainer>
  );
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const PanelContent = ({ vesselsData }) => {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="flex-1 flex flex-col items-stretch">
      <StyledTabsContainer position="static">
        <StyledTabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
        >
          {panels.map((panel) => (
            <StyledTab
              key={panel.value}
              disableRipple
              label={
                <div>
                  <panel.iconComponent
                    style={{
                      verticalAlign: "middle",
                      fontSize: 16,
                    }}
                    className="mr-1"
                  />
                  {panel.label}
                </div>
              }
            />
          ))}
        </StyledTabs>
      </StyledTabsContainer>

      <Scrollbars
        autoHide
        autoHideDuration={200}
        autoHideTimeout={200}
        style={{ height: "100%" }}
      >
        {panels.map(
          (panel) =>
            panel.value === value && (
              <TabPanel key={panel.value} value={value} index={panel.value}>
                {panel.id === "data" ? (
                  <panel.panelComponent vesselsData={vesselsData} />
                ) : (
                  <panel.panelComponent />
                )}
              </TabPanel>
            )
        )}
      </Scrollbars>
    </div>
  );
};

export default PanelContent;
