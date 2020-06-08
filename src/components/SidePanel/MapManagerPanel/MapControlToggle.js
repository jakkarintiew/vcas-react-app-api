import React from "react";
import styled from "styled-components";

const ControlContainer = styled.div`
  background-color: ${(props) => props.theme.labelColor};
  color: ${(props) => props.theme.labelTextColor};
  width: 100%;
  height: 40px;
`;

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

const MapControlToggle = ({ label, checked, onChange }) => {
  return (
    <ControlContainer className="flex flex-row items-center p-2 mb-2">
      <label>
        <span>{label}</span>
      </label>
      <div className="flex-grow" />
      <CheckBoxWrapper className="flex flex-row items-center">
        <CheckBox
          id={label}
          type="checkbox"
          checked={checked}
          onChange={onChange}
        />
        <CheckBoxLabel htmlFor={label} />
      </CheckBoxWrapper>
    </ControlContainer>
  );
};

export default MapControlToggle;
