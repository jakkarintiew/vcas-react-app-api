import React from "react";
import { Line } from "react-chartjs-2";

const VesselLineChart = (props) => {
  var data = props.data;
  var options = {
    animation: {
      duration: 0,
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
  };

  return (
    <div className="flex-1 min-h-0 max-h-8">
      <Line data={data} options={options} />
    </div>
  );
};

export default VesselLineChart;
