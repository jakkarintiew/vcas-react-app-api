import React from "react";
import styled from "styled-components";

const StyledSidePanelContainer = styled.div`
  z-index: 99;
  height: 80%;
  width: ${(props) => props.width};
  display: flex;
  position: absolute;
  padding-top: 15px;
  padding-right: 15px;
  padding-bottom: 15px;
  padding-left: 15px;
`;

const SideBarInner = styled.div`
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
  align-items: stretch;
  background-color: white;
  border-radius: 3px;
  height: 100%;
`;

const SideBar = (props) => {
  const width = props.width;
  return (
    <StyledSidePanelContainer>
      <SideBarInner style={{ width: `${width}px` }}>
        {props.children}
      </SideBarInner>
    </StyledSidePanelContainer>
  );
};

export default SideBar;
