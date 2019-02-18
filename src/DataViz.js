import React, { Component } from "react";
import ViolinChart from "./ViolinChart";
// import D3 from "d3";

class DataViz extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     topTags: []
  //   };
  // }

  render() {
    const APIkeys = Object.keys(this.props.dataSet);
    const genreList = {};
    const filterItems = ["seen live", "All"];

    APIkeys.forEach(date => {
      this.props.dataSet[date].forEach(event => {
        event.artists.forEach(artist => {
          if (artist.topGenres) {
            artist.topGenres.forEach(genre => {
              // console.log(genre);
              if (!genreList[genre.name]) {
                genreList[genre.name] = genre.count;
              } else {
                genreList[genre.name] += genre.count;
              }
            });
          }
        });
      });
    });

    const toptags = Object.keys(genreList).sort((a, b) => {
      return genreList[b] - genreList[a];
    });

    // console.log(toptags);
    // console.log(this.props.dataSet);
    return (
      <div>
        <ViolinChart dataSet={this.props.dataSet} toptags={toptags} />
        {/* <p>Don't look at this shit below</p>
				<img src="https://www.ielts-exam.net/images/graphs/g3.gif"></img> */}
      </div>
    );
  }
}

export default DataViz;
