import React from "react";
import { Scrollbars } from "react-custom-scrollbars";

import PropertyInfo from "./PropertyInfo";
import vessel_type_lookup from "data/vessel_type_lookup.json";

const AlertDetails = ({ alertVessels }) => {
  return (
    <Scrollbars
      autoHide
      autoHideDuration={200}
      autoHideTimeout={200}
      style={{ height: "100%" }}
    >
      <div className="p-3 h-full flex flex-col">
        {alertVessels.map((vessel) => (
          <div key={vessel.mmsi} className="mb-2">
            <PropertyInfo label="Pilot" data={"<PILOT NAME>"} />
            <PropertyInfo label="MMSI" data={vessel.mmsi} />
            <PropertyInfo label="Ship Name" data={vessel.shipname} />
            <PropertyInfo
              label="Ship Type"
              data={
                vessel_type_lookup[vessel.shiptype] +
                " (" +
                vessel.shiptype +
                ")"
              }
            />
            <PropertyInfo label="Speed" data={vessel.speed} />
            <PropertyInfo label="Course" data={vessel.course} />
            <PropertyInfo label="Heading" data={vessel.heading} />
            <PropertyInfo label="Collision Risk" data={vessel.risk} />
          </div>
        ))}
      </div>
    </Scrollbars>
  );
};

export default AlertDetails;
