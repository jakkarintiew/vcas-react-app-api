import React from "react";
import { Line } from "react-chartjs-2";

const VesselLineChart = (props) => {
  return (
    <Line
      data={props.data}
      options={{
        animation: {
          duration: 150,
        },
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
      }}
    />
  );
};

export default VesselLineChart;
