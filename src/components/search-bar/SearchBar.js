import React from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";

import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import { makeStyles } from "@material-ui/core/styles";

import { togglePanelOpenActionCreator } from "app/Redux";
import CollapseButton from "components/common/CollapseButton";
import ArrowRight from "components/common/icons/arrow-right";

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

const SearchBar = () => {
  // Redux states
  const dispatch = useDispatch();
  const panelOpen = useSelector((state) => state.panelOpen);

  const togglePanelOpen = (panelKey) => {
    dispatch(togglePanelOpenActionCreator(panelKey));
  };

  // Component constants
  const initialDegree = 270;
  const height = 40;
  const panelKey = "searchBar";
  const panel =
    panelOpen[Object.keys(panelOpen).find((key) => key === panelKey)];

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

  return (
    <TopPanelBox className="flex-1 flex justify-center">
      <StyledSearchBarContainer height={panel.isOpen ? height : 0}>
        {panel.isOpen && (
          <SearchBarInner className="flex justify-between pl-2">
            <InputBase
              className={classes.input}
              placeholder="Search for vessels, locations..."
            />
            <IconButton type="submit" className={classes.iconButton}>
              <SearchIcon />
            </IconButton>
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
