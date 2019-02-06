import React, { Component } from 'react';
import './SearchResults.css';

class SearchResults extends Component {
	render() {
		const templateResults = (
			<div id="search-results">
				<div className="result">
					<div className="city">Gothenburg, </div>
					<div className="country">Sweden</div>
				</div>
				<div className="result">
					<div className="city">Gothenburg, </div>
					<div className="country">USA</div>
				</div>
				<div className="result">
					<div className="city">Gotham, </div>
					<div className="country">USA</div>
				</div>
			</div>
		);
		return (
			<div>{templateResults}</div>
		);
	}
}

export default SearchResults;