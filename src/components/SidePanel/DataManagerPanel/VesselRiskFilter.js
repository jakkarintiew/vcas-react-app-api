import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import styled from "styled-components";
import Slider from "@material-ui/core/Slider";

import FilterHistogram from "./FilterHistogram";
import data_vessels from "data/data_vessels.json";

import { setVesselRiskFilterRangeActionCreator } from "app/redux";

const FilterShelfContainer = styled.div`
  background-color: ${(props) => props.theme.labelColor};
  color: ${(props) => props.theme.textColor};
  padding: 6px;
  margin-bottom: 8px;
  height: 250px;
`;

const VesselRiskFilter = () => {
  // Redux state
  const dispatch = useDispatch();
  const vesselRiskFilterRange = useSelector((state) => state.vesselRiskFilter);
  const setRiskRange = (newRange) => {
    dispatch(setVesselRiskFilterRangeActionCreator(newRange));
    return;
  };

  const [sliderRange, setSliderRange] = useState(vesselRiskFilterRange);

  const handleSliderChange = (event, value) => {
    setSliderRange(value);
    setRiskRange(value);
  };

  let risk_data = data_vessels.map(({ risk }) => risk);

  return (
    <FilterShelfContainer>
      <div className="px-1 mb-1">
        <b>Vessel Risk Filter</b>
      </div>
      <div className="px-1">
        <FilterHistogram
          data={risk_data}
          highlight={sliderRange}
          className="p-0"
        />
      </div>
      <div className="px-3">
        <Slider
          value={sliderRange}
          onChange={handleSliderChange}
          valueLabelDisplay="auto"
          className="pt-2"
        />
      </div>
    </FilterShelfContainer>
  );
};

export default VesselRiskFilter;
