import React, { useState, useEffect } from "react";
import PropertyInfo from "./PropertyInfo";
import { useSelector } from "react-redux";
import { Line } from "react-chartjs-2";

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
        pointBackgroundColor: "rgba(150, 99, 90, 0.5)",
        borderColor: "rgba(150, 99, 90, 0.5)",
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
        pointBackgroundColor: "rgba(150, 99, 90, 0.5)",
        borderColor: "rgba(150, 99, 90, 0.5)",
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
        pointBackgroundColor: "rgba(150, 99, 90, 0.5)",
        borderColor: "rgba(150, 99, 90, 0.5)",
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
    <div className="p-5">
      <PropertyInfo label="MMSI" data={activeVesselID} />
      <PropertyInfo label="Ship Name" data={activeVessel.shipname} />
      <PropertyInfo label="Ship Type" data={activeVessel.shiptype} />
      <PropertyInfo label="Speed" data={activeVessel.speed} />
      <PropertyInfo label="Course" data={activeVessel.course} />
      <PropertyInfo label="Heading" data={activeVessel.heading} />
      <PropertyInfo label="Collision Risk" data={activeVessel.risk} />
      <div>
        <Line
          data={speed_data}
          height={250}
          options={{
            scales: {
              xAxes: [
                {
                  type: "time",
                  time: {
                    displayFormats: {
                      second: "DD-MM h:mm",
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
        <Line
          data={course_data}
          height={250}
          options={{
            scales: {
              ticks: {
                fontSize: 9,
              },
              xAxes: [
                {
                  type: "time",
                  time: {
                    displayFormats: {
                      second: "DD-MM h:mm",
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
        <Line
          data={heading_data}
          height={250}
          options={{
            scales: {
              xAxes: [
                {
                  type: "time",
                  time: {
                    displayFormats: {
                      second: "DD-MM h:mm",
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
      </div>
    </div>
  );
};

export default VesselDetails;
