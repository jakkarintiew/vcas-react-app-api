import React, { useState } from "react";
import styled from "styled-components";
import { withStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";

import FilterHistogram from "./FilterHistogram";

// const StyledSlider = styled(Slider)`
//   color: #29a9ff;
//   min-height: 0px;
//   height: 5px;
//   padding-top: 0px;
//   padding-bottom: 3px;
// `;

const StyledSlider = withStyles({
  root: {
    color: "#29a9ff",
    height: 4,
    paddingTop: 1,
    paddingBottom: 0,
  },
  thumb: {
    height: 12,
    width: 12,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    marginTop: -5,
    marginLeft: -8,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
  },
  active: {},
  track: {
    height: 4,
    borderRadius: 2,
  },
  rail: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "#c9c9c9",
  },
})(Slider);

const FilterInput = styled.input`
  color: ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.sidePanelBg};
  font-size: 0.8em;
  width: 50px;
  height: 25px;
  border: none;
  border-radius: 3px;
  :focus {
    outline: 0;
  }
`;

const ResetButton = styled.button`
  box-shadow: ${(props) => props.theme.boxShadow};
  background: ${(props) => props.theme.primaryBtnBgd};
  color: ${(props) => props.theme.primaryBtnColor};
  height: 25px;
  font-size: 0.8em;
  border: none;
  border-radius: 6px;
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
            valueLabelDisplay="off"
          />
        </div>
        <div className="flex flex-row items-center justify-between">
          <FilterInput
            value={sliderRange[0]}
            placeholder="Min"
            className="px-2"
            onChange={(e) => handleMinField(parseFloat(e.target.value))}
          />
          <ResetButton className="px-2 m-2" onClick={reset}>
            Reset
          </ResetButton>
          <FilterInput
            value={sliderRange[1]}
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
