import React, { Component } from 'react';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import './SeekZone.css'

class SeekZone extends Component {
	render() {
		return (
			<div id="seek">
				<div id="searchbar">
					<SearchBar />
				</div>
				<div id="searchResults">
					<SearchResults />
				</div>
			</div>
		);
	}
}

export default SeekZone;