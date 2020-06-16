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
} from "app/redux";

const FilterShelfContainer = styled.div`
  background-color: ${(props) => props.theme.labelColor};
  color: ${(props) => props.theme.textColor};
  padding: 6px;
  margin-bottom: 8px;
`;

const ChipsContainer = styled.div`
  min-height: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  list-style: none;
  margin: 0px;
  padding: 1px;
`;

const StyledChip = styled(Chip)`
  background: ${(props) =>
    props.filterstate === "true" ? "#bbe5b8" : "c9c9c9"};
  font-size: 0.7em;
  :focus {
    background: ${(props) =>
      props.filterstate === "true" ? "#bbe5b8" : "c9c9c9"};
    opacity: 1;
  }
  :hover {
    background: ${(props) =>
      props.filterstate === "true" ? "#bbe5b8" : "c9c9c9"};
    opacity: 0.8;
  }
  min-width: auto;
  min-height: auto;
  height: 20px;
  transition: ${(props) => props.theme.transition};
`;

const FilterInput = styled.input`
  color: ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.sidePanelBg};
  font-size: 0.8em;
  border: none;
  border-radius: 3px;
  :focus {
    outline: 0;
  }
`;

const SelectAllButton = styled.button`
  background: ${(props) => props.theme.sidePanelBg};
  color: ${(props) => props.theme.textColor};
  font-size: 0.8em;
  border: none;
  border-radius: 5px;
  :focus {
    outline: 0;
  }
`;

const VesselTypeFilter = () => {
  // Redux states
  const dispatch = useDispatch();
  const vesselTypeFilters = useSelector((state) => state.vesselTypeFilters);
  const visibleTypes = vesselTypeFilters.filter((elem) => elem.visible);

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
    <FilterShelfContainer>
      <div className="px-1 mb-1">
        <b>Vessel Type Filters</b>
      </div>
      <FilterInput
        placeholder="Search vessel type..."
        className="px-2 mb-1 w-full"
        onChange={(e) => searchFilter(e.target.value)}
      />
      <SelectAllButton className="px-2 mb-2 mr-2" onClick={selectAll}>
        Select All
      </SelectAllButton>
      <SelectAllButton className="px-2 mb-2 mr-2" onClick={deselectAll}>
        Deselect All
      </SelectAllButton>
      <Scrollbars
        style={{
          height: 150,
        }}
      >
        <ChipsContainer>
          {visibleTypes.map((vessel) => {
            return (
              <li key={vessel.vesselType} className="pr-1">
                <StyledChip
                  size="small"
                  icon={
                    vessel.filterState ? <DoneIcon /> : <NotInterestedIcon />
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
    </FilterShelfContainer>
  );
};

export default VesselTypeFilter;
