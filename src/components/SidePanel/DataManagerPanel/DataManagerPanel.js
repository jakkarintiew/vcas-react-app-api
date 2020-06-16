import React from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { filterVesselTypeActionCreator } from "app/redux";
import Chip from "@material-ui/core/Chip";
import DoneIcon from "@material-ui/icons/Done";
import NotInterestedIcon from "@material-ui/icons/NotInterested";

const StyledPanelContent = styled.div`
  background-color: ${(props) => props.theme.sidePanelBg};
  width: 100%;
  height: 100%;
  color: ${(props) => props.theme.textColor};
`;

const FilterShelfContainer = styled.div`
  background-color: ${(props) => props.theme.labelColor};
  color: ${(props) => props.theme.textColor};
  padding: 6px;
  margin-bottom: 8px;
`;

const ChipsContainer = styled.div`
  overflow-y: scroll;
  min-height: auto;
  height: 200px;
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  list-style: none;
  margin: 0px;
  padding: 1px;
`;

const StyledChip = styled(Chip)`
  font-size: 0.75em;
  :hover {
    opacity: 0.8;
  }
  min-width: auto;
  min-height: auto;
  height: 20px;
  transition: ${(props) => props.theme.transitionFast};
`;

const DataManagerPanel = () => {
  // Redux states
  const dispatch = useDispatch();
  const vesselTypeFilters = useSelector((state) => state.vesselTypeFilters);
  const toggleFilter = (vesselType) => {
    dispatch(filterVesselTypeActionCreator(vesselType));
  };

  const handleClick = (vesselType) => () => {
    toggleFilter(vesselType);
  };

  return (
    <StyledPanelContent>
      <FilterShelfContainer>
        <div className="px-1 mb-2">
          <b>Vessel Type Filters</b>
        </div>
        <ChipsContainer>
          {vesselTypeFilters.map((vessel) => {
            return (
              <li key={vessel.vesselType} className="pr-1">
                <StyledChip
                  size="small"
                  icon={
                    vessel.filterState ? <DoneIcon /> : <NotInterestedIcon />
                  }
                  label={vessel.vesselType}
                  onClick={handleClick(vessel.vesselType)}
                  clickable
                  disableRipple
                  style={{
                    backgroundColor: vessel.filterState ? "#bbe5b8" : "#c9c9c9",
                  }}
                />
              </li>
            );
          })}
        </ChipsContainer>
      </FilterShelfContainer>
    </StyledPanelContent>
  );
};
export default DataManagerPanel;
