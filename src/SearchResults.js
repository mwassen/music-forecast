import React, { Component } from 'react';
import './SearchResults.css';

class SearchResults extends Component {
	constructor(props) {
		super(props);

		this.organiseResults = this.organiseResults.bind(this);
	}

	organiseResults(results) {
		console.log("trigger");
		return results.map((location, ind) => {
			return(
				<li className="result" key={ind}>
					<div className="city">{location.city.displayName}, </div>
					<div className="country">{location.city.country.displayName}</div>
				</li>
			);
		});
	}

	render() {
		return(
			<ul id="search-results">
				{this.organiseResults(this.props.apiResults)}
			</ul>
		);
	}
}

export default SearchResults;