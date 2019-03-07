import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import SeekZone from "./SeekZone";
import DataViz from "./DataViz";
import APIkeys from "./SECRET-api";
import LoadingAnimation from "./LoadingAnimation";

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
    const dataForViz = [];
    const maxPages = 10;

    // Run API calls
    fetchSongkick()
      .then(data => {
        // Handle multiple artist events
        data.forEach(page => {
          if (page.resultsPage)
            page.resultsPage.results.event.forEach(event => {
              // Create data structure for event information
              dataForViz.push({
                date: event.start.date,
                name: event.displayName,
                artists: event.performance,
                link: event.uri
              });
            });
        });
        const fetches = [];
        dataForViz.forEach(event => {
          event.artists.forEach(artist => {
            fetches.push(fetchLastFm(artist));
          });
        });
        return Promise.all(fetches);
      })
      .then(() => {
        // console.log("API done!!");
        this.setState({
          loading: false,
          stats: dataForViz
        });
      });

    // API FUNCTIONS
    // Query Songkick API for set amount of pages
    function fetchSongkick() {
      const songkickURL =
        "https://api.songkick.com/api/3.0/metro_areas/" +
        locationId +
        "/calendar.json?apikey=" +
        APIkeys.songkick;

      return baseFetch(1).then(data => {
        const songkickReqs = [];
        const totalEntries = data.resultsPage.totalEntries;
        const reqPages =
          totalEntries < maxPages * 50
            ? Math.ceil(totalEntries / 50)
            : maxPages;

        songkickReqs.push(data);
        for (let i = 2; i <= reqPages; i++) {
          songkickReqs.push(baseFetch(i));
        }
        return Promise.all(songkickReqs);
      });

      function baseFetch(page) {
        const pageParam = "&page=" + page;
        return fetch(songkickURL + pageParam).then(response => {
          if (response.status !== 200) {
            console.log(
              "Looks like there was a problem with the SongKick metro area events API. Status Code: " +
                response.status
            );
            return;
          } else return response.json();
        });
      }
    }

    // Query LastFM API for genre tags for set artist
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
  }

  render() {
    function showViz(data) {
      if (data) {
        return (
          <div className="data-visuals">
            <DataViz dataSet={data} />
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
        {showViz(this.state.stats)}
      </div>
    );
  }
}

export default App;
