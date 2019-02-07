import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import SeekZone from './SeekZone';
import DataViz from './DataViz';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
         
        </header>
        <SeekZone />
        {/* <DataViz /> */}
      </div>
    );
  }
}

export default App;
