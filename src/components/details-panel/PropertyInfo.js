import React from "react";
import styled from "styled-components";

const PropertyLabel = styled.div`
  background-color: ${(props) => props.theme.labelColor};
  color: ${(props) => props.theme.labelTextColor};
  font-size: 0.75em;
  font-weight: 500;
  padding: 3px 5px 3px 5px;
  width: 45%;
`;

const PropertyData = styled.div`
  background-color: ${(props) => props.theme.panelBackground};
  color: ${(props) => props.theme.labelTextColor};
  font-size: 0.75em;
  font-weight: 200;
  padding: 3px 5px 3px 5px;
  width: 100%;
`;

const PropertyInfo = (props) => {
  return (
    <div className="mb-1 flex">
      <PropertyLabel>{props.label}</PropertyLabel>
      <PropertyData> {props.data}</PropertyData>
    </div>
  );
};

export default PropertyInfo;