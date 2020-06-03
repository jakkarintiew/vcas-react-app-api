import React, { useState, useEffect } from "react";
import PropertyInfo from "./PropertyInfo";
import { useSelector } from "react-redux";

import VesselLineChart from "./VesselLineChart";

const VesselDetails = (props) => {
  const activeVesselInitialState = {
    mmsi: null,
    timestamp: null,
    shipname: "",
    shiptype: "",
    latitude: "",
    longitude: null,
    speed: null,
    course: null,
    heading: null,
    risk: null,
    historical_path: [0],
    future_path: [0],
    historical_speed: [0],
    future_speed: [0],
    historical_course: [0],
    future_course: [0],
    historical_heading: [0],
    future_heading: [0],
    historical_timestamps: [0],
    future_timestamps: [0],
  };
  const activeVesselID = useSelector((state) => state.activeVesselID);
  const [activeVessel, setActiveVessel] = useState(activeVesselInitialState);

  useEffect(() => {
    if (activeVesselID != null) {
      const activeVessel = props.data.filter((data) => {
        return data.mmsi === activeVesselID;
      })[0];
      setActiveVessel(activeVessel);
    }
  }, [activeVesselID, props]);

  const speed_data = {
    datasets: [
      {
        label: "Historical Speed",
        fill: false,
        lineTension: 0,
        pointBackgroundColor: "rgba(225, 105, 40, 0.5)",
        borderColor: "rgba(225, 105, 40, 0.5)",
        pointRadius: 1,
        data: [
          ...activeVessel.historical_timestamps.map((x, i) => ({
            x: activeVessel.historical_timestamps[i] * 1000,
            y: activeVessel.historical_speed[i],
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
          ...activeVessel.future_timestamps.map((x, i) => ({
            x: activeVessel.future_timestamps[i] * 1000,
            y: activeVessel.future_speed[i],
          })),
        ],
      },
    ],
  };

  const course_data = {
    datasets: [
      {
        label: "Historical Course",
        fill: false,
        lineTension: 0,
        pointBackgroundColor: "rgba(225, 105, 40, 0.5)",
        borderColor: "rgba(225, 105, 40, 0.5)",
        pointRadius: 1,
        data: [
          ...activeVessel.historical_timestamps.map((x, i) => ({
            x: activeVessel.historical_timestamps[i] * 1000,
            y: activeVessel.historical_course[i],
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
          ...activeVessel.future_timestamps.map((x, i) => ({
            x: activeVessel.future_timestamps[i] * 1000,
            y: activeVessel.future_course[i],
          })),
        ],
      },
    ],
  };

  const heading_data = {
    datasets: [
      {
        label: "Historical Heading",
        fill: false,
        lineTension: 0,
        pointBackgroundColor: "rgba(225, 105, 40, 0.5)",
        borderColor: "rgba(225, 105, 40, 0.5)",
        pointRadius: 1,
        data: [
          ...activeVessel.historical_timestamps.map((x, i) => ({
            x: activeVessel.historical_timestamps[i] * 1000,
            y: activeVessel.historical_heading[i],
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
          ...activeVessel.future_timestamps.map((x, i) => ({
            x: activeVessel.future_timestamps[i] * 1000,
            y: activeVessel.future_heading[i],
          })),
        ],
      },
    ],
  };

  return (
    <div className="p-3 h-full flex flex-col">
      <div className="p-1">
        <PropertyInfo label="MMSI" data={activeVesselID} />
        <PropertyInfo label="Ship Name" data={activeVessel.shipname} />
        <PropertyInfo label="Ship Type" data={activeVessel.shiptype} />
        <PropertyInfo label="Speed" data={activeVessel.speed} />
        <PropertyInfo label="Course" data={activeVessel.course} />
        <PropertyInfo label="Heading" data={activeVessel.heading} />
        <PropertyInfo label="Collision Risk" data={activeVessel.risk} />
      </div>
      <div className="flex flex-col flex-auto min-h-0">
        <div className="flex-1 min-h-0">
          <VesselLineChart data={speed_data} yMax={20} />
        </div>
        <div className="flex-1 min-h-0">
          <VesselLineChart data={course_data} yMax={360} />
        </div>
        <div className="flex-1 min-h-0">
          <VesselLineChart data={heading_data} yMax={360} />
        </div>
      </div>
    </div>
  );
};

export default VesselDetails;
