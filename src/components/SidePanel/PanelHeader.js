import React from "react";
import styled from "styled-components";
import VCASLogo from "./logo";

const StyledPanelHeader = styled.div`
  transition: ${(props) => props.theme.transition};
  background-color: ${(props) => props.theme.sidePanelHeaderBg};
  padding: 12px 16px 12px 16px;
  border-radius: 5px 5px 0px 0px;
`;

const StyledPanelHeaderTop = styled.div`
  display: flex;
  transition: ${(props) => props.theme.transition};
  background-color: ${(props) => props.theme.sidePanelHeaderBg};
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
