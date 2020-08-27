import React from "react";
import styled from "styled-components";

import PropertyInfo from "./PropertyInfo";
import vessel_type_lookup from "data/vessel_type_lookup.json";

const CardContainer = styled.div`
  background-color: ${(props) => props.theme.sidePanelHeaderBg};
  padding: 0px 0px 0px 0px;
  width: 100%;
  margin-bottom: 10px;
`;

const CardHeader = styled.div`
  background-color: ${(props) => props.headerColor};
  padding: 6px 10px 6px 10px;
  height: 80px;
  width: 100%;
`;

const PropertyContainer = styled.div`
  background-color: ${(props) => props.theme.sidePanelHeaderBg};
  padding: 5px 5px 5px 5px;
  width: 100%;
`;

const ChipsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0px;
  padding: 0px;
`;

const VesselName = styled.div`
  color: ${"#FFFFFF"};
  font-size: 20px;
  font-weight: 800;
`;

const VesselSubTitle = styled.div`
  color: ${"#FFFFFF"};
  font-size: 12px;
  font-weight: 400;
`;

const VesselDetailsCard = ({ vessel, headerColor }) => {
  return (
    <CardContainer className="flex flex-col">
      <CardHeader headerColor={headerColor}>
        <VesselName>{vessel.shipname}</VesselName>
        <VesselSubTitle>{"MMSI: " + vessel.mmsi}</VesselSubTitle>
        <VesselSubTitle>
          {vessel_type_lookup[vessel.shiptype] + " (" + vessel.shiptype + ")"}
        </VesselSubTitle>
      </CardHeader>
      <PropertyContainer>
        <PropertyInfo label="Pilotage" data={"<PILOT INFO>"} />
        <ChipsContainer>
          <PropertyInfo label="Speed" data={vessel.speed} />
          <PropertyInfo
            label="Collision Risk"
            data={Math.round((vessel.risk + Number.EPSILON) * 100) / 100}
          />
          <PropertyInfo label="Course" data={vessel.course} />
          <PropertyInfo label="Heading" data={vessel.heading} />
        </ChipsContainer>
      </PropertyContainer>
    </CardContainer>
  );
};

export default VesselDetailsCard;
