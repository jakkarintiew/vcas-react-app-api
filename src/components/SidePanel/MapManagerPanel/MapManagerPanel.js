import React from "react";
import ThemeToggler from "components/SidePanel/MapManagerPanel/ThemeToggler";
import styled from "styled-components";

const StyledPanelContent = styled.div`
  transition: ${(props) => props.theme.transition};
  background-color: ${(props) => props.theme.sidePanelBg};
  width: 100%;
  height: 100%;
  color: ${(props) => props.theme.textColor};
  display: inline-flex;
  flex-direction: row;
`;
const MapManagerPanel = () => {
  return (
    <div>
      <StyledPanelContent>
        <span>Dark theme </span>
        <ThemeToggler />
      </StyledPanelContent>
    </div>
  );
};

export default MapManagerPanel;
