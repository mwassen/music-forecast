import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import SeekZone from "./SeekZone";
import LoadingAnimation from "./LoadingAnimation";
import JoyPlot from "./JoyPlot";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: null,
      loading: false,
      stats: null
    };
    this.locationSearch = this.locationSearch.bind(this);
  }

  locationSearch(locationId, string) {
    this.setState({
      location: string,
      loading: true,
      stats: null
    });

    const URL = "https://music-forecast.herokuapp.com/events/" + locationId;

    fetch(URL)
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.setState({
          loading: false,
          stats: data
        });
      });
  }

  render() {
    function showViz(data, location) {
      if (data) {
        return (
          <div className="data-visuals">
            <JoyPlot dataSet={data} location={location} />
          </div>
        );
      }
    }

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <SeekZone locationSearch={this.locationSearch} />
        <div className="locationName">{this.state.location}</div>
        <LoadingAnimation active={this.state.loading} />
        {showViz(this.state.stats, this.state.location)}
      </div>
    );
  }
}

export default App;
