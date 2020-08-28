import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { FlyToInterpolator } from "deck.gl";
import { TRANSITION_EVENTS } from "react-map-gl";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import { makeStyles } from "@material-ui/core/styles";

import {
  togglePanelOpenActionCreator,
  setViewStatesActionCreator,
  setActiveVesselsActionCreator,
} from "app/Redux";
import CollapseButton from "components/common/CollapseButton";
import ArrowRight from "components/common/icons/arrow-right";

import dataFairways from "data/seamark_fairways.json";
import dataAnchorages from "data/seamark_anchorages.json";
import dataMooringAreas from "data/seamark_mooring_areas.json";
import vesselTypeLookup from "data/vessel_type_lookup.json";

const TopPanelBox = styled.div`
  width: 100%;
  height: ${(props) => props.height + 2 * props.theme.sidePanel.margin.top}px;
  position: relative;
`;

const StyledSearchBarContainer = styled.div`
  z-index: 99;
  height: ${(props) => props.height + 2 * props.theme.sidePanel.margin.top}px;
  width: 100%;
  max-width: 600px;
  display: flex;
  position: relative;
  padding-top: ${(props) => props.theme.sidePanel.margin.top}px;
  padding-bottom: ${(props) => props.theme.sidePanel.margin.top}px;
  padding-right: 33px;
  padding-left: 10px;
  transition: ${(props) => props.theme.transitionFast};
`;

const SearchBarInner = styled.div`
  align-items: stretch;
  box-shadow: ${(props) => props.theme.panelBoxShadow};
  background-color: ${(props) => props.theme.sidePanelBg};
  height: 100%;
  width: 100%;
  border-radius: 18px;
`;

const SearchField = styled.div`
  height: 100%;
  width: 100%;
`;

const StyledIconButton = styled(IconButton)`
  color: ${(props) => props.theme.textColor};
  opacity: 0.6;
  border: none;
  :focus {
    outline: 0;
  }
  :hover {
    opacity: 1;
  }
`;

const SearchBar = () => {
  // Redux states
  const dispatch = useDispatch();
  const panelOpen = useSelector((state) => state.panelOpen);
  const mapView = useSelector((state) => state.mapView);
  const allVessels = useSelector((state) => state.vesselData.allVesselData);
  const vesselTypeFilter = useSelector((state) => state.vesselTypeFilter);
  const vesselSliderFilter = useSelector((state) => state.vesselSliderFilter);

  const visibleVessels = allVessels.filter((vessel) => {
    const visibleTypes = vesselTypeFilter.map((vessel) => {
      return vessel.filterState ? vessel.vesselType : null;
    });
    return (
      visibleTypes.includes(vesselTypeLookup[vessel.shiptype]) &&
      vessel.risk >= vesselSliderFilter.risk[0] &&
      vessel.risk <= vesselSliderFilter.risk[1] &&
      vessel.speed >= vesselSliderFilter.speed[0] &&
      vessel.speed <= vesselSliderFilter.speed[1] &&
      vessel.speed >= 1
    );
  });

  const togglePanelOpen = (panelKey) => {
    dispatch(togglePanelOpenActionCreator(panelKey));
  };

  const setViewStates = (newViewState) => {
    dispatch(setViewStatesActionCreator(newViewState));
  };

  const updateView = (object) => {
    // Zoom to event
    setViewStates({
      main: {
        ...mapView.viewStates.main,
        longitude: object.longitude,
        latitude: object.latitude,
        zoom: 13,
        pitch: 0,
        bearing: 0,
        transitionDuration: 500,
        transitionInterruption: TRANSITION_EVENTS.UPDATE,
        transitionInterpolator: new FlyToInterpolator(),
      },
      minimap: {
        ...mapView.viewStates.minimap,
      },
    });
  };

  const setActiveVessels = (vessel) => {
    dispatch(setActiveVesselsActionCreator(vessel));
  };

  // Component states
  const [value, setValue] = React.useState(null);
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = useState([]);

  // Component constants
  const initialDegree = 270;
  const height = 40;
  const panelKey = "searchBar";
  const panel =
    panelOpen[Object.keys(panelOpen).find((key) => key === panelKey)];

  const searchOptions = [
    ...dataFairways.map((location) => ({
      type: "location",
      name: location.name,
      longitude: location.longitude,
      latitude: location.latitude,
    })),
    ...dataAnchorages.map((location) => ({
      type: "location",
      name: location.name,
      longitude: location.longitude,
      latitude: location.latitude,
    })),
    ...dataMooringAreas.map((location) => ({
      type: "location",
      name: location.name,
      longitude: location.longitude,
      latitude: location.latitude,
    })),
    ...visibleVessels.map((vessel) => ({
      type: "vessel",
      name: vessel.shipname,
      mmsi: vessel.mmsi,
      longitude: vessel.longitude,
      latitude: vessel.latitude,
    })),
  ];

  const handleOnClick = (event) => {
    togglePanelOpen(panelKey);
  };

  const useStyles = makeStyles((theme) => ({
    root: {
      padding: "2px 4px",
      display: "flex",
      alignItems: "center",
      width: 400,
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
  }));

  const classes = useStyles();

  useEffect(() => {
    if (inputValue === "") {
      setOptions(value ? [value] : []);
      return undefined;
    } else {
      let newOptions = searchOptions.filter((option) => {
        if (option.type === "location") {
          return option.name
            .toString()
            .toLowerCase()
            .includes(inputValue.toString().toLowerCase());
        } else if (option.type === "vessel") {
          return (
            option.name
              .toString()
              .toLowerCase()
              .includes(inputValue.toString().toLowerCase()) ||
            option.mmsi
              .toString()
              .toLowerCase()
              .includes(inputValue.toString().toLowerCase())
          );
        } else {
          return undefined;
        }
      });
      setOptions(newOptions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, inputValue]);

  return (
    <TopPanelBox className="flex-1 flex justify-center">
      <StyledSearchBarContainer height={panel.isOpen ? height : 0}>
        {panel.isOpen && (
          <SearchBarInner className="flex pl-2">
            <SearchField>
              <Autocomplete
                id="search"
                freeSolo
                size="small"
                getOptionLabel={(option) => {
                  if (option.type === "location") {
                    return option.name;
                  } else if (option.type === "vessel") {
                    return option.name + " (" + option.mmsi + ")";
                  }
                }}
                options={options}
                value={value}
                onChange={(event, newValue) => {
                  setOptions(newValue ? [newValue, ...options] : options);
                  setValue(newValue);
                  if (newValue) {
                    updateView(newValue);
                    if (newValue.type === "vessel") {
                      setActiveVessels(
                        allVessels.filter(
                          (vessel) => vessel.mmsi === newValue.mmsi
                        )
                      );
                    }
                  }
                }}
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    className={classes.input}
                    placeholder="Search for vessels, locations..."
                    margin="dense"
                    variant="standard"
                    InputProps={{
                      ...params.InputProps,
                      disableUnderline: true,
                    }}
                  />
                )}
              />
            </SearchField>

            <StyledIconButton type="submit" className={classes.iconButton}>
              <SearchIcon />
            </StyledIconButton>
          </SearchBarInner>
        )}
        <CollapseButton
          onClick={handleOnClick}
          style={{ right: "8px", bottom: "-25px" }}
        >
          <ArrowRight
            height="12px"
            style={{
              transform: `rotate(${
                panel.isOpen ? initialDegree : initialDegree + 180
              }deg)`,
            }}
          />
        </CollapseButton>
      </StyledSearchBarContainer>
    </TopPanelBox>
  );
};

export default SearchBar;
