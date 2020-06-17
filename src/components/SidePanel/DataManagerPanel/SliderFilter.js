import React, { useState } from "react";
import styled from "styled-components";
import Slider from "@material-ui/core/Slider";
import FilterHistogram from "./FilterHistogram";

const StyledSlider = styled(Slider)`
  color: ${(props) => props.theme.labelTextColor};
  min-height: 0px;
  height: 5px;
  padding-top: 0px;
  padding-bottom: 3px;
`;

const FilterInput = styled.input`
  color: ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.sidePanelBg};
  font-size: 0.8em;
  width: 50px;
  height: 20px;
  border: none;
  border-radius: 3px;
  :focus {
    outline: 0;
  }
`;

const ResetButton = styled.button`
  background: ${(props) => props.theme.sidePanelBg};
  box-shadow: ${(props) => props.theme.boxShadow};
  color: ${(props) => props.theme.textColor};
  font-size: 0.8em;
  border: none;
  border-radius: 5px;
  :focus {
    outline: 0;
  }
`;

const SliderFilter = (props) => {
  const { data, domain, binSize, reduxRange, setReduxRange } = props;
  const [sliderRange, setSliderRange] = useState(reduxRange);

  const handleSliderChange = (event, value) => {
    setSliderRange(value);
    setReduxRange(value);
  };

  const handleMinField = (min) => {
    const oldRange = sliderRange;
    const max = oldRange[1];
    if (min >= domain[1]) min = domain[1];
    if (min <= domain[0] || isNaN(min)) min = domain[0];
    if (min >= max) min = max;
    setSliderRange([min, max]);
    setReduxRange([min, max]);
  };

  const handleMaxField = (max) => {
    const oldRange = sliderRange;
    const min = oldRange[0];
    if (max <= domain[0]) max = domain[0];
    if (max > domain[1] || isNaN(max)) max = domain[1];
    if (max <= min) max = min;
    setSliderRange([min, max]);
    setReduxRange([min, max]);
  };

  const reset = () => {
    setSliderRange(domain);
    setReduxRange(domain);
  };
  return (
    <div>
      <div className="px-1">
        <ResetButton className="px-2 mb-2 mr-2" onClick={reset}>
          Reset
        </ResetButton>
        <FilterHistogram
          data={data}
          domain={domain}
          binSize={binSize}
          highlight={sliderRange}
          className="p-0"
        />
        <div className="px-1">
          <StyledSlider
            value={sliderRange}
            min={domain[0]}
            max={domain[1]}
            onChange={handleSliderChange}
            valueLabelDisplay="auto"
          />
        </div>
        <div className="flex flex-row justify-between">
          <FilterInput
            placeholder="Min"
            className="px-2"
            onChange={(e) => handleMinField(parseFloat(e.target.value))}
          />
          <FilterInput
            placeholder="Max"
            className="px-2"
            onChange={(e) => handleMaxField(parseFloat(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

export default SliderFilter;
