import React, { useState } from "react";
// import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { toggleLayerVisibilityActionCreator } from "app/redux";

const Checkbox = (props) => <input type="checkbox" {...props} />;

const LayerVisibilityCheckBox = (props) => {
  // Redux states
  const dispatch = useDispatch();
  const layerVisibility = useSelector((state) => state.layerVisibility);
  const toggleLayerVisibility = (layerID) => {
    dispatch(toggleLayerVisibilityActionCreator(layerID));
  };

  const layer =
    layerVisibility[
      Object.keys(layerVisibility).find(
        (key) => layerVisibility[key].label === props.name
      )
    ];

  // Component states
  const [checked, setChecked] = useState(layer.visible);
  const handleCheckboxChange = (event) => {
    setChecked(event.target.checked);
    toggleLayerVisibility(layer.id);
  };

  return (
    <div>
      <label>
        <Checkbox checked={checked} onChange={handleCheckboxChange} />
        <span>{props.name}</span>
      </label>
    </div>
  );
};

export default LayerVisibilityCheckBox;
