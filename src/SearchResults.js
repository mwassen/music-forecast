import React, { Component } from 'react';
import './SearchResults.css';

class SearchResults extends Component {
	constructor(props) {
		super(props);

		this.organiseResults = this.organiseResults.bind(this);
		this.clickResult = this.clickResult.bind(this);
	}

	organiseResults(results) {
		return results.map((location, ind) => {
			return(
				<li className="result" key={ind} onClick={(e) => this.clickResult(location.metroArea.id, e)}>
					<div className="city">{location.city.displayName}, </div>
					<div className="country">{location.city.country.displayName}</div>
				</li>
			);
		});
	}

	clickResult(id) {
		this.props.locationSearch(id)
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