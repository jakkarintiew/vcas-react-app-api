import React, { useState } from "react";
import styled from "styled-components";

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
  width: 40%;
`;

const StyledInput = styled.input`
  color: ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.sidePanelBg};
  font-size: 0.75em;
  border: none;
  :focus {
    outline: 0;
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
        <StyledInput
          value={startTime}
          onChange={(event) => setStartTime(event.target.value)}
          type="search"
          placeholder="e.g. 01 Jan 2019 12:00"
          className="pl-2"
        />
      </div>
      <div className="mb-1 flex flex-row items-stretch">
        <StyledLabel className="flex-none">End Time</StyledLabel>
        <StyledInput
          value={endTime}
          onChange={(event) => setEndTime(event.target.value)}
          type="search"
          placeholder="e.g. 03 Jan 2019 03:00"
          className="pl-2"
        />
      </div>
      <div className="mb-1 flex flex-row items-stretch">
        <StyledLabel className="flex-none">Refresh Interval</StyledLabel>
        <StyledInput
          value={interval}
          onChange={(event) => setInterval(event.target.value)}
          type="search"
          placeholder="Set interval in seconds..."
          className="pl-2"
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
