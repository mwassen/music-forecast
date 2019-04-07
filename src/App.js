import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import SeekZone from "./SeekZone";
import LoadingAnimation from "./LoadingAnimation";
import JoyPlot from "./DataVisuals";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: null,
      loading: true,
      ready: false,
      stats: null
    };
    this.locationSearch = this.locationSearch.bind(this);
    this.homeReset = this.homeReset.bind(this);
  }

  componentDidMount() {
    console.log("sent");
    const URL = "https://music-forecast.herokuapp.com/status/";

    fetch(URL).then(response => {
      if (response.status === 200) {
        this.setState({
          loading: false,
          ready: true
        });
      }
    });
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

  homeReset() {
    this.setState({
      location: null,
      loading: false,
      stats: null
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img
            src={logo}
            className="App-logo"
            alt="logo"
            onClick={this.homeReset}
          />
        </header>
        {this.state.ready ? (
          <div>
            <SeekZone locationSearch={this.locationSearch} />
            <div className="locationName">{this.state.location}</div>
            <LoadingAnimation active={this.state.loading} />
            {this.state.stats && (
              <div className="data-visuals">
                <JoyPlot
                  dataSet={this.state.stats}
                  location={this.state.location}
                />
              </div>
            )}
          </div>
        ) : (
          <LoadingAnimation active={this.state.loading} />
        )}
      </div>
    );
  }
}

export default App;
