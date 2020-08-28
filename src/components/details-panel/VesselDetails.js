import React from "react";

import { Scrollbars } from "react-custom-scrollbars";

import VesselDetailsCard from "./VesselDetailsCard";
import VesselLineChart from "./VesselLineChart";

const VesselDetails = ({ vessel, historicalPath, futurePath }) => {
  const speedChartData = {
    datasets: [
      {
        label: "Historical Speed",
        fill: false,
        lineTension: 0,
        pointBackgroundColor: "rgba(150, 150, 150, 0.75)",
        borderColor: "rgba(150, 150, 150, 0.75)",
        pointRadius: 1,
        data: [
          ...historicalPath.timestamps.map((x, i) => ({
            x: historicalPath.timestamps[i] * 1000,
            y: historicalPath.speed[i],
          })),
        ],
      },
      {
        label: "Future Speed",
        fill: false,
        lineTension: 0,
        pointBackgroundColor: "rgb(41, 169, 255, 0.5)",
        borderColor: "rgb(41, 169, 255, 0.5)",
        pointRadius: 1,
        data: [
          ...futurePath.timestamps.map((x, i) => ({
            x: futurePath.timestamps[i] * 1000,
            y: futurePath.speed[i],
          })),
        ],
      },
    ],
  };

  // const courseChartData = {
  //   datasets: [
  //     {
  //       label: "Historical Course",
  //       fill: false,
  //       lineTension: 0,
  //       pointBackgroundColor: "rgba(150, 150, 150, 0.75)",
  //       borderColor: "rgba(150, 150, 150, 0.75)",
  //       pointRadius: 1,
  //       data: [
  //         ...historicalPath.timestamps.map((x, i) => ({
  //           x: historicalPath.timestamps[i] * 1000,
  //           y: historicalPath.course[i],
  //         })),
  //       ],
  //     },
  //     {
  //       label: "Future Course",
  //       fill: false,
  //       lineTension: 0,
  //       pointBackgroundColor: "rgb(41, 169, 255, 0.5)",
  //       borderColor: "rgb(41, 169, 255, 0.5)",
  //       pointRadius: 1,
  //       data: [
  //         ...futurePath.timestamps.map((x, i) => ({
  //           x: futurePath.timestamps[i] * 1000,
  //           y: futurePath.course[i],
  //         })),
  //       ],
  //     },
  //   ],
  // };

  // const headingChartData = {
  //   datasets: [
  //     {
  //       label: "Historical Heading",
  //       fill: false,
  //       lineTension: 0,
  //       pointBackgroundColor: "rgba(150, 150, 150, 0.75)",
  //       borderColor: "rgba(150, 150, 150, 0.75)",
  //       pointRadius: 1,
  //       data: [
  //         ...historicalPath.timestamps.map((x, i) => ({
  //           x: historicalPath.timestamps[i] * 1000,
  //           y: historicalPath.heading[i],
  //         })),
  //       ],
  //     },
  //     {
  //       label: "Future Heading",
  //       fill: false,
  //       lineTension: 0,
  //       pointBackgroundColor: "rgb(41, 169, 255, 0.5)",
  //       borderColor: "rgb(41, 169, 255, 0.5)",
  //       pointRadius: 1,
  //       data: [
  //         ...futurePath.timestamps.map((x, i) => ({
  //           x: futurePath.timestamps[i] * 1000,
  //           y: futurePath.heading[i],
  //         })),
  //       ],
  //     },
  //   ],
  // };

  return (
    <Scrollbars
      autoHide
      autoHideDuration={200}
      autoHideTimeout={200}
      style={{ height: "100%" }}
    >
      <div className="p-3 h-full flex flex-col">
        <VesselDetailsCard
          vessel={vessel}
          headerColor={"#0A9DFF"}
        ></VesselDetailsCard>
        <div>
          <VesselLineChart
            chartTitle={"Speed-Time Graph"}
            data={speedChartData}
            yMax={20}
          />
          {/* <VesselLineChart data={courseChartData} yMax={360} /> */}
          {/* <VesselLineChart data={headingChartData} yMax={360} /> */}
        </div>
      </div>
    </Scrollbars>
  );
};

export default VesselDetails;
