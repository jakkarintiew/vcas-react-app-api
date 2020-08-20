import React from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";

import {
  setVesselRiskFilterRangeActionCreator,
  setVesselSpeedFilterRangeActionCreator,
} from "app/Redux";
import SliderFilter from "./SliderFilter";

const FilterWidgetContainer = styled.div`
  background-color: ${(props) => props.theme.sidePanelHeaderBg};
  color: ${(props) => props.theme.textColor};
  padding: 6px;
  margin-bottom: 8px;
  max-height: 250px;
`;

const VesselSliderFilters = ({ vesselsData }) => {
  // Redux state
  const dispatch = useDispatch();
  const vesselSliderFilter = useSelector((state) => state.vesselSliderFilter);

  const setRiskRange = (newRange) => {
    dispatch(setVesselRiskFilterRangeActionCreator(newRange));
  };
  const setSpeedRange = (newRange) => {
    dispatch(setVesselSpeedFilterRangeActionCreator(newRange));
  };

  const riskData = vesselsData.map(({ risk }) => risk);
  const riskDomain = [0, 100];
  const riskBinSize = 5;

  const speedData = vesselsData.map(({ speed }) => speed);
  const speedDomain = [0, 35];
  const speedBinSize = 2.5;

  return (
    <div>
      <FilterWidgetContainer>
        <div className="px-1 mb-1">
          <b>Vessel Risk Filter</b>
        </div>
        <SliderFilter
          data={riskData}
          domain={riskDomain}
          binSize={riskBinSize}
          reduxRange={vesselSliderFilter.risk}
          setReduxRange={setRiskRange}
        />
      </FilterWidgetContainer>
      <FilterWidgetContainer>
        <div className="px-1 mb-1">
          <b>Vessel Speed Filter</b>
        </div>
        <SliderFilter
          data={speedData}
          domain={speedDomain}
          binSize={speedBinSize}
          reduxRange={vesselSliderFilter.speed}
          setReduxRange={setSpeedRange}
        />
      </FilterWidgetContainer>
    </div>
  );
};

export default VesselSliderFilters;
