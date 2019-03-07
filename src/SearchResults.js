import React, { Component } from "react";
import "./SearchResults.css";

class SearchResults extends Component {
  constructor(props) {
    super(props);

    this.organiseResults = this.organiseResults.bind(this);
    this.clickResult = this.clickResult.bind(this);
  }

  organiseResults(results) {
    return results.map((location, ind) => {
      const locationString = location.city.state
        ? location.city.displayName +
          ", " +
          location.city.state.displayName +
          ", " +
          location.city.country.displayName
        : location.city.displayName + ", " + location.city.country.displayName;

      return (
        <li
          className="result"
          key={ind}
          onClick={e =>
            this.clickResult(location.metroArea.id, locationString, e)
          }
        >
          <div className="city">{location.city.displayName}, </div>
          {stateInclude(location)}
          <div className="country">{location.city.country.displayName}</div>
        </li>
      );

      function stateInclude(location) {
        if (location.city.state) {
          return (
            <div className="state">{location.city.state.displayName}, </div>
          );
        } else return null;
      }
    });
  }

  clickResult(id, string) {
    this.props.locationSearch(id, string);
    this.props.onResultClick();
  }

  render() {
    return (
      <ul id="search-results">{this.organiseResults(this.props.apiResults)}</ul>
    );
  }
}

export default SearchResults;
