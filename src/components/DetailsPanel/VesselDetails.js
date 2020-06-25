import React from "react";

import PropertyInfo from "./PropertyInfo";

// import { Scrollbars } from "react-custom-scrollbars";

import VesselLineChart from "./VesselLineChart";
import vessel_type_lookup from "data/vessel_type_lookup.json";

const VesselDetails = ({ activeVessel, pathData }) => {
  const speedChartData = {
    datasets: [
      {
        label: "Historical Speed",
        fill: false,
        lineTension: 0,
        pointBackgroundColor: "rgba(225, 105, 40, 0.5)",
        borderColor: "rgba(225, 105, 40, 0.5)",
        pointRadius: 1,
        data: [
          ...pathData.historical_timestamps.map((x, i) => ({
            x: pathData.historical_timestamps[i] * 1000,
            y: pathData.historical_speed[i],
          })),
        ],
      },
      {
        label: "Future Speed",
        fill: false,
        lineTension: 0,
        pointBackgroundColor: "rgba(54, 225, 215, 0.5)",
        borderColor: "rgba(54, 225, 215, 0.5)",
        pointRadius: 1,
        data: [
          ...pathData.future_timestamps.map((x, i) => ({
            x: pathData.future_timestamps[i] * 1000,
            y: pathData.future_speed[i],
          })),
        ],
      },
    ],
  };

  const courseChartData = {
    datasets: [
      {
        label: "Historical Course",
        fill: false,
        lineTension: 0,
        pointBackgroundColor: "rgba(225, 105, 40, 0.5)",
        borderColor: "rgba(225, 105, 40, 0.5)",
        pointRadius: 1,
        data: [
          ...pathData.historical_timestamps.map((x, i) => ({
            x: pathData.historical_timestamps[i] * 1000,
            y: pathData.historical_course[i],
          })),
        ],
      },
      {
        label: "Future Course",
        fill: false,
        lineTension: 0,
        pointBackgroundColor: "rgba(54, 225, 215, 0.5)",
        borderColor: "rgba(54, 225, 215, 0.5)",
        pointRadius: 1,
        data: [
          ...pathData.future_timestamps.map((x, i) => ({
            x: pathData.future_timestamps[i] * 1000,
            y: pathData.future_course[i],
          })),
        ],
      },
    ],
  };

  const headingChartData = {
    datasets: [
      {
        label: "Historical Heading",
        fill: false,
        lineTension: 0,
        pointBackgroundColor: "rgba(225, 105, 40, 0.5)",
        borderColor: "rgba(225, 105, 40, 0.5)",
        pointRadius: 1,
        data: [
          ...pathData.historical_timestamps.map((x, i) => ({
            x: pathData.historical_timestamps[i] * 1000,
            y: pathData.historical_heading[i],
          })),
        ],
      },
      {
        label: "Future Heading",
        fill: false,
        lineTension: 0,
        pointBackgroundColor: "rgba(54, 225, 215, 0.5)",
        borderColor: "rgba(54, 225, 215, 0.5)",
        pointRadius: 1,
        data: [
          ...pathData.future_timestamps.map((x, i) => ({
            x: pathData.future_timestamps[i] * 1000,
            y: pathData.future_heading[i],
          })),
        ],
      },
    ],
  };

  const shipType =
    vessel_type_lookup[activeVessel.shiptype] +
    " (" +
    activeVessel.shiptype +
    ")";

  return (
    <div className="p-3 h-full flex flex-col">
      <div className="p-1">
        <PropertyInfo label="MMSI" data={activeVessel.mmsi} />
        <PropertyInfo label="Ship Name" data={activeVessel.shipname} />
        <PropertyInfo label="Ship Type" data={shipType} />
        <PropertyInfo label="Speed" data={activeVessel.speed} />
        <PropertyInfo label="Course" data={activeVessel.course} />
        <PropertyInfo label="Heading" data={activeVessel.heading} />
        <PropertyInfo label="Collision Risk" data={activeVessel.risk} />
      </div>
      <div className="flex flex-col flex-auto min-h-0">
        <VesselLineChart data={speedChartData} yMax={20} />
        <VesselLineChart data={courseChartData} yMax={360} />
        <VesselLineChart data={headingChartData} yMax={360} />
      </div>
    </div>
  );
};

export default VesselDetails;
