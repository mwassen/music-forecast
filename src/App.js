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
            {this.state.location && (
              <div className="locationName">{this.state.location}</div>
            )}
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

        <div id="logo-padding" />
        <a href="../">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            id="mswsn-logo"
            viewBox="0 0 104 18.5"
          >
            <title>mswsn</title>
            <g id="Layer_1-2" data-name="Layer 1">
              <path d="M17.5,0h-3a1,1,0,0,0-1,1V3.5a1,1,0,0,1-1,1h-2a1,1,0,0,1-1-1V1a1,1,0,0,0-1-1h-3a1,1,0,0,0-1,1V3.5a1,1,0,0,1-1,1H1a1,1,0,0,0-1,1v12a1,1,0,0,0,1,1H4a1,1,0,0,0,1-1V6A1,1,0,0,1,6,5H8A1,1,0,0,1,9,6V8.5a1,1,0,0,0,1,1h3a1,1,0,0,0,1-1V6a1,1,0,0,1,1-1h2a1,1,0,0,1,1,1V17.5a1,1,0,0,0,1,1h3a1,1,0,0,0,1-1V5.5a1,1,0,0,0-1-1H19.5a1,1,0,0,1-1-1V1A1,1,0,0,0,17.5,0Z" />
              <path d="M62,13.5H60a1,1,0,0,1-1-1V10a1,1,0,0,0-1-1H55a1,1,0,0,0-1,1v2.5a1,1,0,0,1-1,1H51a1,1,0,0,1-1-1V1a1,1,0,0,0-1-1H46a1,1,0,0,0-1,1V13a1,1,0,0,0,1,1h2.5a1,1,0,0,1,1,1v2.5a1,1,0,0,0,1,1h3a1,1,0,0,0,1-1V15a1,1,0,0,1,1-1h2a1,1,0,0,1,1,1v2.5a1,1,0,0,0,1,1h3a1,1,0,0,0,1-1V15a1,1,0,0,1,1-1H67a1,1,0,0,0,1-1V1a1,1,0,0,0-1-1H64a1,1,0,0,0-1,1V12.5A1,1,0,0,1,62,13.5Z" />
              <path d="M28,9.5h3a1,1,0,0,0,1-1V6a1,1,0,0,1,1-1h7a1,1,0,0,0,1-1V1a1,1,0,0,0-1-1H28a1,1,0,0,0-1,1V8.5A1,1,0,0,0,28,9.5Z" />
              <path d="M35,13.5H28a1,1,0,0,0-1,1v3a1,1,0,0,0,1,1H40a1,1,0,0,0,1-1V10a1,1,0,0,0-1-1H37a1,1,0,0,0-1,1v2.5A1,1,0,0,1,35,13.5Z" />
              <path d="M99.5,3.5V1a1,1,0,0,0-1-1H91a1,1,0,0,0-1,1V17.5a1,1,0,0,0,1,1h3a1,1,0,0,0,1-1V6a1,1,0,0,1,1-1h2a1,1,0,0,1,1,1V17.5a1,1,0,0,0,1,1h3a1,1,0,0,0,1-1V5.5a1,1,0,0,0-1-1h-2.5A1,1,0,0,1,99.5,3.5Z" />
              <path d="M73,9.5h3a1,1,0,0,0,1-1V6a1,1,0,0,1,1-1h7a1,1,0,0,0,1-1V1a1,1,0,0,0-1-1H73a1,1,0,0,0-1,1V8.5A1,1,0,0,0,73,9.5Z" />
              <path d="M80,13.5H73a1,1,0,0,0-1,1v3a1,1,0,0,0,1,1H85a1,1,0,0,0,1-1V10a1,1,0,0,0-1-1H82a1,1,0,0,0-1,1v2.5A1,1,0,0,1,80,13.5Z" />
            </g>
          </svg>
        </a>
      </div>
    );
  }
}

export default App;
