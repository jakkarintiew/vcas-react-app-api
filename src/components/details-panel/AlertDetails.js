import React from "react";
import { useSelector } from "react-redux";

import { Scrollbars } from "react-custom-scrollbars";

import VesselDetailsCard from "./VesselDetailsCard";

const AlertDetails = ({ alertVessels }) => {
  const alertColors = useSelector((state) => state.vesselData.alertColors);

  return (
    <Scrollbars
      autoHide
      autoHideDuration={200}
      autoHideTimeout={200}
      style={{ height: "100%" }}
    >
      <div className="p-3 h-full flex flex-col">
        {alertVessels.map((vessel, index) => (
          <VesselDetailsCard
            key={vessel.mmsi}
            vessel={vessel}
            headerColor={alertColors[index].fill}
          ></VesselDetailsCard>
        ))}
      </div>
    </Scrollbars>
  );
};

export default AlertDetails;
