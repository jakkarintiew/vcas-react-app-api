import React from "react";
import SideBar from "./SideBar";
import PanelHeader from "./PanelHeader";
import PanelContent from "./PanelContent";

const SidePanel = () => {
  return (
    <div>
      <SideBar>
        <PanelHeader />
        <PanelContent />
      </SideBar>
    </div>
  );
};

export default SidePanel;
