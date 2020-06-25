import React, { useState } from "react";
import styled from "styled-components";
import DateTimePicker from "react-datetime-picker";

const DataSourceWidgetContainer = styled.div`
  background-color: ${(props) => props.theme.sidePanelHeaderBg};
  color: ${(props) => props.theme.textColor};
  padding: 6px;
  margin-bottom: 8px;
`;

const StyledLabel = styled.div`
  background-color: ${(props) => props.theme.labelColor};
  color: ${(props) => props.theme.labelTextColor};
  font-size: 0.75em;
  font-weight: 500;
  padding: 3px 5px 3px 5px;
  height: 25px;
  width: 100px;
`;

const StyledInput = styled.input`
  color: ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.sidePanelBg};
  font-size: 0.75em;
  height: 25px;
  padding: 2px;
  border: none;
  :focus {
    outline: 0;
  }
`;

const StyledDateTimePicker = styled(function ({ className, onChange, value }) {
  return (
    <DateTimePicker
      className={"flex-auto " + className}
      autoFocus={false}
      calendarIcon={null}
      disableClock={true}
      format={"yyyy/MM/dd H:mm:ss"}
      calendarClassName={className}
      onChange={onChange}
      value={value}
    />
  );
})`
  font-size: 0.75em;

  .react-datetime-picker__wrapper {
    background-color: ${(props) => props.theme.sidePanelBg};
    color: ${(props) => props.theme.textColor};
    border: none;
  }

  .react-datetime-picker__inputGroup__input {
    color: ${(props) => props.theme.textColor};
    :focus {
      outline: 0;
    }
  }

  .react-datetime-picker__inputGroup__input:invalid {
    background-color: ${(props) => props.theme.sidePanelBg};
  }

  .react-datetime-picker__calendar .react-calendar {
    padding: 2px;
    margin: 0px;
    font-size: 0.8em;
    box-shadow: ${(props) => props.theme.panelBoxShadow};
    background-color: ${(props) => props.theme.sidePanelBg};
    color: ${(props) => props.theme.textColor};
    border: none;
  }
`;

const StyledButton = styled.button`
  box-shadow: ${(props) => props.theme.boxShadow};
  background: ${(props) => props.theme.primaryBtnBgd};
  color: ${(props) => props.theme.primaryBtnColor};
  font-size: 0.75em;
  border: none;
  border-radius: 6px;
  :focus {
    outline: 0;
  }
`;

const DataSourceControl = () => {
  const initalState = "";
  const [startTime, setStartTime] = useState(initalState);
  const [endTime, setEndTime] = useState(initalState);
  const [interval, setInterval] = useState(initalState);

  const resetInputs = () => {
    setStartTime(initalState);
    setEndTime(initalState);
    setInterval(initalState);
  };

  const loadData = () => {
    console.log("Load data...");
  };

  return (
    <DataSourceWidgetContainer>
      <div className="px-1 mb-1">
        <b>Data Source</b>
      </div>
      <div className="mb-1 flex flex-row items-stretch">
        <StyledLabel className="flex-none">Start Time</StyledLabel>
        <StyledDateTimePicker onChange={setStartTime} value={startTime} />
      </div>
      <div className="mb-1 flex flex-row items-stretch">
        <StyledLabel className="flex-none">End Time</StyledLabel>
        <StyledDateTimePicker onChange={setEndTime} value={endTime} />
      </div>
      <div className="mb-1 flex flex-row items-stretch">
        <StyledLabel className="flex-none">Refresh Interval</StyledLabel>
        <StyledInput
          value={interval}
          onChange={(event) => setInterval(event.target.value)}
          type="search"
          placeholder="Set interval in seconds..."
          className="pl-2 flex-auto"
        />
      </div>
      <div className="py-1">
        <StyledButton className="px-2 mr-2" onClick={resetInputs}>
          Reset
        </StyledButton>
        <StyledButton className="px-2 mr-2" onClick={loadData}>
          Load Data
        </StyledButton>
      </div>
    </DataSourceWidgetContainer>
  );
};

export default DataSourceControl;
