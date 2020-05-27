import React from "react";
import SideBar from "./side-panel/SideBar";
import PanelHeader from "./side-panel/PanelHeader";
import PanelContent from "./side-panel/PanelContent";

// export default class SidePanel extends PureComponent {
//   render() {
const SidePanel = () => {
  return (
    <div>
      <SideBar>
        <PanelHeader />
        <PanelContent />
        {/* <PanelTabs /> */}
      </SideBar>
    </div>
  );
};

export default SidePanel;
