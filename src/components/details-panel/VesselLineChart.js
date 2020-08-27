import React from "react";
import { Line } from "react-chartjs-2";
import styled from "styled-components";

const ChartContainer = styled.div`
  background-color: ${(props) => props.theme.sidePanelHeaderBg};
  color: ${(props) => props.theme.textColor};
  padding: 6px;
  margin-bottom: 5px;
`;

const GraphContainer = styled.div`
  color: ${(props) => props.theme.textColor};
  height: 250px;
`;

const VesselLineChart = ({ chartTitle, data, yMax }) => {
  var options = {
    animation: {
      duration: 0,
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          ticks: {
            fontSize: 9,
            min: 0,
            suggestedMax: yMax,
          },
        },
      ],
      xAxes: [
        {
          ticks: {
            fontSize: 9,
          },
          type: "time",
          time: {
            displayFormats: {
              millisecond: "hh:mm",
              second: "hh:mm",
            },
          },
        },
      ],
    },
    legend: {
      labels: {
        fontSize: 9,
      },
    },
  };

  return (
    <ChartContainer>
      <div className="px-1 mb-1">
        <b>{chartTitle}</b>
      </div>
      <GraphContainer>
        <Line data={data} options={options} />
      </GraphContainer>
    </ChartContainer>
  );
};

export default VesselLineChart;
