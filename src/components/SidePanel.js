import React, {PureComponent} from 'react';
import SideBar from './side-panel/SideBar';
import PanelHeader from './side-panel/PanelHeader';
import PanelContent from './side-panel/PanelContent'

export default class SidePanel extends PureComponent {
  render() {
    return (
      <div> 
        <SideBar> 
          <PanelHeader />
          <PanelContent />
        </SideBar>
      </div>
    );
  }
}

