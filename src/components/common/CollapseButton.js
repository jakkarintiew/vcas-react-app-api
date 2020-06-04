import styled from "styled-components";

const CollapseButton = styled.div`
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  justify-content: center;
  background-color: ${(props) => props.theme.sideBarCloseBtnBgd};
  border-radius: 1px;
  color: ${(props) => props.theme.sideBarCloseBtnColor};
  display: flex;
  height: 20px;
  position: absolute;
  top: ${(props) => props.theme.sidePanel.margin.top + 5}px;
  width: 20px;
  :hover {
    cursor: pointer;
    box-shadow: none;
    background-color: ${(props) => props.theme.sideBarCloseBtnBgdHover};
  }
`;

export default CollapseButton;
