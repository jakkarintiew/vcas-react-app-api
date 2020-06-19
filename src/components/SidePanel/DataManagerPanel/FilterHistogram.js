import React from "react";
import { Bar } from "react-chartjs-2";

function histogram(data, size, domain) {
  let min = domain[0];
  let max = domain[1];

  // for (const item of data) {
  //   if (item < min) min = item;
  //   else if (item > max) max = item;
  // }

  const bins = Math.floor((max - min + 1) / size);

  var histogram = [];
  for (let i = min; i < bins; i++) {
    histogram.push({
      bin: i * size,
      count: 0,
    });
  }

  for (const item of data) {
    const index = histogram.findIndex(
      (elem) => elem.bin === Math.floor((item - min) / size) * size
    );
    histogram[index].count++;
  }

  return histogram;
}

const FilterHistogram = (props) => {
  const { data, domain, binSize, highlight } = props;

  var hist = histogram(data, binSize, domain);

  var chart_data = {
    labels: hist.map((elem) => elem.bin),
    datasets: [
      {
        data: hist.map((elem) => elem.count),
        backgroundColor: hist.map((elem) =>
          elem.bin >= highlight[0] && elem.bin <= highlight[1]
            ? "#29a9ff"
            : "#c9c9c9"
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
      <Bar data={chart_data} height={70} options={options} />
    </div>
  );
};

export default FilterHistogram;
