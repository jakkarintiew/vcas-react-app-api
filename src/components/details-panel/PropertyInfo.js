import React from "react";
import styled from "styled-components";

const PropertyLabel = styled.div`
  background-color: ${(props) => props.theme.labelColor};
  color: ${(props) => props.theme.labelTextColor};
  font-size: 12px;
  font-weight: 600;
  padding: 3px 3px 3px 3px;
  min-width: 80px;
`;

const PropertyData = styled.div`
  background-color: ${(props) => props.theme.panelBackground};
  color: ${(props) => props.theme.labelTextColor};
  font-size: 12px;
  font-weight: 400;
  padding: 3px 3px 3px 3px;
  margin-right: 1px;
  width: 100%;
  min-width: 49px;
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
