import React, { Component } from "react";
import JoyPlot from "./JoyPlot";

class DataViz extends Component {
  render() {
    const genreList = {};
    const filterItems = ["seen live", "All", "under 2000 listeners"];

    this.props.dataSet.forEach(event => {
      event.artists.forEach(artist => {
        if (artist.topGenres) {
          artist.topGenres.forEach(genre => {
            if (!genreList[genre.name]) {
              genreList[genre.name] = genre.count;
            } else {
              genreList[genre.name] += genre.count;
            }
          });
        }
      });
    });

    const toptags = Object.keys(genreList)
      .sort((a, b) => {
        return genreList[b] - genreList[a];
      })
      .slice(0, 30)
      .filter(genre => {
        let present = true;
        filterItems.forEach(fakeGenre => {
          if (genre === fakeGenre) present = false;
        });
        return present;
      })
      .slice(0, 20);

    function reOrganise(data, top20) {
      const output = [];
      data.forEach(event => {
        event.artists.forEach(artist => {
          if (artist.topGenres) {
            artist.topGenres.forEach(genre => {
              top20.forEach(hotGenre => {
                if (genre.name === hotGenre) {
                  output.push({
                    genre: genre.name,
                    weight: genre.count,
                    date: event.date,
                    details: event
                  });
                }
              });
            });
          }
        });
      });
      return output;
    }

    return (
      <div>
        <JoyPlot
          dataSet={reOrganise(this.props.dataSet, toptags)}
          location={this.props.location}
        />
      </div>
    );
  }
}

export default DataViz;
