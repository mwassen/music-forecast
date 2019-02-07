import React, { Component } from 'react';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import './SeekZone.css';
import APIkeys from './SECRET-api';


class SeekZone extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchText: '',
			searchResults: false
		}

		this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
	}

	handleSearchTextChange(input) {
		this.setState({
			searchText: input
		}, () => {
			const query = this.state.searchText;
			if (query !== '') {
				const URL = 'https://api.songkick.com/api/3.0/search/locations.json?query=' + query + '&apikey=' + APIkeys.songkick;
	
				fetch(URL)
					.then(response => {
						if (response.status !== 200) {
							console.log('Looks like there was a problem. Status Code: ' + response.status);
							return;
						} else return response.json();
					}).then(data => {
						if(data.resultsPage.totalEntries > 0) {
							this.setState({
								searchResults: data.resultsPage.results.location.slice(0, 5)
							});
						}
					});
			}
		});
	}

	render() {
		let results;
		if (this.state.searchResults.length > 1) {
			results = (
				<div id="searchResults">
					<SearchResults 
						apiResults={this.state.searchResults}
						locationSearch={this.props.locationSearch}
					/>
				</div>
			)
		} else results = false;

		return (
			<div id="seek">
				<div id="searchbar">
					<SearchBar 
						searchText={this.state.searchText} 
						onSearchTextChange={this.handleSearchTextChange}
					/>
				</div>
				{results}
			</div>
		);
	}
}

export default SeekZone;