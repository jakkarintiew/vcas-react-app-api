import React from "react";
import { Line } from "react-chartjs-2";
import styled from "styled-components";

const ChartContainer = styled.div`
  background-color: ${(props) => props.theme.sidePanelHeaderBg};
  color: ${(props) => props.theme.textColor};
  padding: 6px;
  margin-bottom: 5px;
  height: 250px;
`;

const VesselLineChart = (props) => {
  var data = props.data;
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
            suggestedMax: props.yMax,
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
      <Line data={data} options={options} />
    </ChartContainer>
  );
};

export default VesselLineChart;
