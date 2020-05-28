import React from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { toggleThemeActionCreator } from "app/redux";

const CheckBoxWrapper = styled.div`
  position: relative;
  margin-left: 30px;
`;

const CheckBoxLabel = styled.label`
  position: absolute;
  top: 0;
  left: 0;
  width: 42px;
  height: 26px;
  border-radius: 15px;
  background: #bebebe;
  cursor: pointer;
  &::after {
    content: "";
    display: block;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    margin: 3px;
    background: #ffffff;
    transition: 0.2s;
  }
`;
const CheckBox = styled.input`
  opacity: 0;
  z-index: 3;
  border-radius: 15px;
  width: 42px;
  height: 26px;
  &:checked + ${CheckBoxLabel} {
    background: #009e8c;
    &::after {
      content: "";
      display: block;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      margin-left: 21px;
      transition: 0.2s;
    }
  }
`;

const ThemeToggler = () => {
  const dispatch = useDispatch();
  const darkThemeEnabled = useSelector((state) => state.darkThemeEnabled);
  const toggleTheme = () => {
    dispatch(toggleThemeActionCreator());
  };
  return (
    <div>
      <CheckBoxWrapper>
        <CheckBox
          id="checkbox"
          type="checkbox"
          checked={darkThemeEnabled}
          onChange={toggleTheme}
        />
        <CheckBoxLabel htmlFor="checkbox" />
      </CheckBoxWrapper>
    </div>
  );
};

export default ThemeToggler;
