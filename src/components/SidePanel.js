import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
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

