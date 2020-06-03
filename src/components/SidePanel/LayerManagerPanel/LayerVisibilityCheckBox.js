import React, { useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { toggleLayerVisibilityActionCreator } from "app/redux";

const Checkbox = (props) => <input type="checkbox" {...props} />;

const LayerContainer = styled.div`
  background-color: ${(props) => props.theme.labelColor};
  color: ${(props) => props.theme.labelTextColor};
  width: 100%;
  height: 40px;
`;

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
    <LayerContainer className="flex flex-row items-center p-2 mb-2">
      <label>
        <span>{props.name}</span>
      </label>
      <div className="flex-grow" />
      <Checkbox
        className="mr-3"
        checked={checked}
        onChange={handleCheckboxChange}
      />
    </LayerContainer>
  );
};

export default LayerVisibilityCheckBox;
