import React from "react";
import styled from "styled-components";
import VCASLogo from "./logo";

const StyledPanelHeader = styled.div`
  background-color: lightgrey;
  padding: 12px 16px 12px 16px;
`;

const StyledPanelHeaderTop = styled.div`
  display: flex;
  background-color: lightgrey;
  justify-content: space-between;
  margin-bottom: 16px;
  width: 100%;
`;

const PanelHeader = () => {
  return (
    <StyledPanelHeader>
      <StyledPanelHeaderTop>
        <VCASLogo />
      </StyledPanelHeaderTop>
    </StyledPanelHeader>
  );
};

export default PanelHeader;
