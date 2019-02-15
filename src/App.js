import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import SeekZone from "./SeekZone";
import DataViz from "./DataViz";
import APIkeys from "./SECRET-api";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stats: {}
    };
    this.locationSearch = this.locationSearch.bind(this);
  }

  locationSearch(locationId) {
    const songkickURL =
      "https://api.songkick.com/api/3.0/metro_areas/" +
      locationId +
      "/calendar.json?apikey=" +
      APIkeys.songkick;

    // API call to songkick for concerts in selected metro area
    fetch(songkickURL)
      .then(response => {
        if (response.status !== 200) {
          console.log(
            "Looks like there was a problem with the SongKick metro area events API. Status Code: " +
              response.status
          );
          return;
        } else return response.json();
      })
      .then(data => {
        // Handle multiple artist events
        const artistNames = [];
        data.resultsPage.results.event.forEach(event => {
          event.performance.forEach(performer => {
            artistNames.push(performer.displayName);
          });
        });

        // console.log(artistNames);

        // Query last.fm for tags for all artists
        const artists = artistNames.map(artist => {
          const lastfmURL =
            "http://ws.audioscrobbler.com/2.0/?method=artist.gettoptags&artist=" +
            artist +
            "&api_key=" +
            APIkeys.lastfm +
            "&format=json";
          return fetch(lastfmURL).then(response => {
            if (response.status !== 200) {
              console.log(
                "Looks like there was a problem with the Last.fm API. Status Code: " +
                  response.status
              );
              return;
            } else return response.json();
          });
        });

        return Promise.all(artists);
      })
      .then(dataSet => {
        // Filters out undefined values & errors
        const cleanDataSet = dataSet.filter(data => {
          if (data === undefined) {
            return false;
          } else if (data.error) {
            return false;
          } else return true;
        });

        // Variable for storing data
        const tagStats = {};

        // Loads genres into seperate objects and assigns Last.fm weighting
        cleanDataSet.forEach(data => {
          data.toptags.tag.forEach(genre => {
            if (tagStats[genre.name] === undefined) {
              tagStats[genre.name] = genre.count;
            } else {
              tagStats[genre.name] += genre.count;
            }
          });
        });

        // Attaches results to component state
        this.setState({
          stats: tagStats
        });
      });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <SeekZone locationSearch={this.locationSearch} />
        <DataViz dataSet={this.state.stats} />
      </div>
    );
  }
}

export default App;
