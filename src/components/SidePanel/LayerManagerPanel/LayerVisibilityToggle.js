import React from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { toggleLayerVisibilityActionCreator } from "app/redux";

import EyeSeen from "components/common/icons/eye-seen";
import EyeUnseen from "components/common/icons/eye-unseen";

const LayerContainer = styled.div`
  background-color: ${(props) => props.theme.sidePanelBg};
  color: ${(props) => props.theme.labelTextColor};
  font-size: 0.8em;
  width: 100%;
  height: 30px;
`;

const LayerVisibilityToggle = ({ layerName }) => {
  // Redux states
  const dispatch = useDispatch();
  const layerVisibility = useSelector((state) => state.layerVisibility);
  const toggleLayerVisibility = (layerName) => {
    dispatch(toggleLayerVisibilityActionCreator(layerName));
  };

  const layer =
    layerVisibility[
      Object.keys(layerVisibility).find(
        (key) => layerVisibility[key].layerName === layerName
      )
    ];

  const handleOnClick = (event) => {
    toggleLayerVisibility(layer.layerName);
  };

  return (
    <LayerContainer className="flex flex-row items-center p-2 mb-1">
      <label>{layerName}</label>
      <div className="flex-grow" />
      <div className="relative mr-1 cursor-pointer" onClick={handleOnClick}>
        {layer.visible ? (
          <EyeSeen height="25px" />
        ) : (
          <EyeUnseen height="25px" />
        )}
      </div>
    </LayerContainer>
  );
};

export default LayerVisibilityToggle;
