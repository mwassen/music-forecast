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
    this.wakeUpServer = this.wakeUpServer.bind(this);
    this.locationSearch = this.locationSearch.bind(this);
    this.homeReset = this.homeReset.bind(this);
  }

  componentDidMount() {
    this.wakeUpServer();
  }

  wakeUpServer() {
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
      ready: false,
      stats: null
    });
    this.wakeUpServer();
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
          <div id="main-content">
            <SeekZone locationSearch={this.locationSearch} />
            <div className="locationName">{this.state.location}</div>
            <LoadingAnimation
              active={this.state.loading}
              text="retrieving results"
            />
            {this.state.stats ? (
              <div className="data-visuals">
                <JoyPlot
                  dataSet={this.state.stats}
                  location={this.state.location}
                />
              </div>
            ) : this.state.loading ? null : (
              <div id="notes">
                <p id="bug-note">
                  (7 April 2019) note: The entire world is not in the midst of
                  some dreamy latvian trippy sludge metal takeover, the last.fm
                  API is currently somewhat broken...
                </p>
              </div>
            )}
          </div>
        ) : (
          <LoadingAnimation
            active={this.state.loading}
            text="contacting server"
          />
        )}
      </div>
    );
  }
}

export default App;
