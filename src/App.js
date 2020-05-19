import React, {Component} from 'react';
import MapContainer from './components/MapContainer';
import SidePanel from './components/SidePanel';

class App extends Component {
  render() {
    return (
      <div> 
        <SidePanel/>  
        <MapContainer/>  
      </div>
    );
  }
}

export default App;