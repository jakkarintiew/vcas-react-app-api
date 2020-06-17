import React from "react";
import { Bar } from "react-chartjs-2";

function histogram(data, size, range) {
  let min = range[0];
  let max = range[1];

  // for (const item of data) {
  //   if (item < min) min = item;
  //   else if (item > max) max = item;
  // }

  const bins = Math.floor((max - min + 1) / size);

  var histogram = [];
  for (let i = 0; i < bins; i++) {
    histogram.push({
      bin: (i + 1) * size,
      count: 0,
    });
  }

  for (const item of data) {
    const index = histogram.findIndex(
      (elem) => elem.bin === Math.ceil((item - min) / size) * size
    );
    histogram[index].count++;
  }

  return histogram;
}

const FilterHistogram = (props) => {
  const { data, highlight } = props;

  var binSize = 5;
  var hist = histogram(data, binSize, [0, 100]);

  var chart_data = {
    labels: hist.map((elem) => elem.bin),
    datasets: [
      {
        data: hist.map((elem) => elem.count),
        // backgroundColor: "#1FBAD6",
        backgroundColor: hist.map((elem) =>
          elem.bin >= highlight[0] && elem.bin <= highlight[1]
            ? "#1FBAD6"
            : "#9e9e9e"
        ),
      },
    ],
  };

  var options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0,
    },
    legend: {
      display: false,
    },
    scales: {
      xAxes: [
        {
          display: false,
        },
      ],
      yAxes: [
        {
          display: false,
          ticks: {
            min: 0,
          },
        },
      ],
    },
  };

  return (
    <div className="flex-1 min-h-0">
      <Bar data={chart_data} height={100} options={options} />
    </div>
  );
};

export default FilterHistogram;
