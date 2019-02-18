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
    const dataForViz = {};
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
        // console.log(data);
        // const artistNames = [];
        data.resultsPage.results.event.forEach(event => {
          // Create data structure for event information
          if (dataForViz[event.start.date]) {
            dataForViz[event.start.date].push({
              name: event.displayName,
              artists: event.performance,
              link: event.uri
            });
          } else {
            dataForViz[event.start.date] = [
              {
                name: event.displayName,
                artists: event.performance,
                link: event.uri
              }
            ];
          }

          // event.performance.forEach(performer => {
          //   artistNames.push(performer.displayName);
          // });
        });

        // console.log(dataForViz);

        const dates = Object.keys(dataForViz);
        // console.log(dates);

        const fetches = [];

        dates.forEach(date => {
          dataForViz[date].forEach(event => {
            event.artists.forEach(artist => {
              // console.log(artist);
              fetches.push(fetchLastFm(artist));
            });
          });
        });

        function fetchLastFm(artist) {
          const lastfmURL =
            "http://ws.audioscrobbler.com/2.0/?method=artist.gettoptags&artist=" +
            artist.displayName +
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
            } else
              return response.json().then(data => {
                if (data.toptags) {
                  artist.topGenres = data.toptags.tag;
                }
              });
          });
        }

        return Promise.all(fetches);

        // Query last.fm for tags for all artists
        // const artists = artistNames.map(artist => {
        //   const lastfmURL =
        //     "http://ws.audioscrobbler.com/2.0/?method=artist.gettoptags&artist=" +
        //     artist +
        //     "&api_key=" +
        //     APIkeys.lastfm +
        //     "&format=json";
        //   return fetch(lastfmURL).then(response => {
        //     if (response.status !== 200) {
        //       console.log(
        //         "Looks like there was a problem with the Last.fm API. Status Code: " +
        //           response.status
        //       );
        //       return;
        //     } else return response.json();
        //   });
        // });
      })
      .then(() => {
        this.setState({
          stats: dataForViz
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
