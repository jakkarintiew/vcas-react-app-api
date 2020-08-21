import React from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";

import Chip from "@material-ui/core/Chip";
import DoneIcon from "@material-ui/icons/Done";
import NotInterestedIcon from "@material-ui/icons/NotInterested";
import { Scrollbars } from "react-custom-scrollbars";

import {
  filterVesselTypeActionCreator,
  searchFilterActionCreator,
  selectAllActionCreator,
  deselectAllActionCreator,
} from "app/Redux";

const FilterWidgetContainer = styled.div`
  background-color: ${(props) => props.theme.sidePanelHeaderBg};
  color: ${(props) => props.theme.textColor};
  padding: 6px;
  margin-bottom: 8px;
  height: 300px;
`;

const ChipsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  list-style: none;
  margin: 0px;
  padding: 0px;
  line-height: 1.1em;
`;

const StyledChip = styled(Chip)`
  background: ${(props) =>
    props.filterstate === "true" ? "#29a9ff" : "#c9c9c9"};
  color: ${(props) => (props.filterstate === "true" ? "#ffffff" : "#808080")};
  font-size: 0.7em;
  :focus {
    background: ${(props) =>
      props.filterstate === "true" ? "#29a9ff" : "#c9c9c9"};
  }
  :hover {
    background: ${(props) =>
      props.filterstate === "true" ? "#42baff" : "#e3e3e3"};
  }
  min-width: auto;
  min-height: auto;
  height: 18px;
  line-height: 1em;
  margin-left: 0px;
  margin-right: 1px;
  margin-top: 0px;
  margin-bottom: 0px;
  transition: ${(props) => props.theme.transition};
`;

const FilterInput = styled.input`
  color: ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.sidePanelBg};
  font-size: 0.75em;
  border: none;
  border-radius: 3px;
  :focus {
    outline: 0;
  }
`;

const SelectAllButton = styled.button`
  box-shadow: ${(props) => props.theme.boxShadow};
  background: ${(props) => props.theme.primaryBtnBgd};
  color: ${(props) => props.theme.primaryBtnColor};
  font-size: 0.75em;
  border: none;
  border-radius: 6px;
  :focus {
    outline: 0;
  }
`;

const VesselTypeFilter = () => {
  // Redux states
  const dispatch = useDispatch();
  const vesselTypeFilter = useSelector((state) => state.vesselTypeFilter);
  const visibleTypes = vesselTypeFilter.filter((elem) => elem.visible);

  const toggleFilter = (vesselType) => {
    dispatch(filterVesselTypeActionCreator(vesselType));
  };

  const searchFilter = (searchStr) => {
    dispatch(searchFilterActionCreator(searchStr));
  };

  const selectAll = () => {
    dispatch(selectAllActionCreator());
  };

  const deselectAll = () => {
    dispatch(deselectAllActionCreator());
  };

  const handleChipClick = (vesselType) => () => {
    toggleFilter(vesselType);
  };

  return (
    <FilterWidgetContainer className="flex flex-col items-stretch">
      <div className="px-1 mb-1">
        <b>Vessel Type Filters</b>
      </div>
      <FilterInput
        type="search"
        placeholder="Search vessel type..."
        className="px-2 mb-1 w-full"
        onChange={(e) => searchFilter(e.target.value)}
      />
      <div>
        <SelectAllButton className="px-2 mb-2 mr-2" onClick={selectAll}>
          Select All
        </SelectAllButton>
        <SelectAllButton className="px-2 mb-2 mr-2" onClick={deselectAll}>
          Deselect All
        </SelectAllButton>
      </div>
      <Scrollbars
        autoHide
        autoHideDuration={200}
        autoHideTimeout={200}
        style={{ height: "100%" }}
      >
        <ChipsContainer>
          {visibleTypes.map((vessel) => {
            return (
              <li key={vessel.vesselType}>
                <StyledChip
                  size="small"
                  icon={
                    vessel.filterState ? (
                      <DoneIcon style={{ color: "#ffffff" }} />
                    ) : (
                      <NotInterestedIcon style={{ color: "#808080" }} />
                    )
                  }
                  label={vessel.vesselType}
                  onClick={handleChipClick(vessel.vesselType)}
                  clickable
                  disableRipple
                  filterstate={vessel.filterState.toString()}
                />
              </li>
            );
          })}
        </ChipsContainer>
      </Scrollbars>
    </FilterWidgetContainer>
  );
};

export default VesselTypeFilter;
