import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import SeekZone from './SeekZone';
import DataViz from './DataViz';
import APIkeys from './SECRET-api';


class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			stats: {}
		}

		this.locationSearch = this.locationSearch.bind(this);
	}

	locationSearch(locationId) {
		const songkickURL = 'https://api.songkick.com/api/3.0/metro_areas/' + locationId + '/calendar.json?apikey=' + APIkeys.songkick;

		fetch(songkickURL)
			.then(response => {
				if (response.status !== 200) {
					console.log('Looks like there was a problem. Status Code: ' + response.status);
					return;
				} else return response.json();
			}).then(data => {
				const artists = data.resultsPage.results.event.map(event => {
					if (event.performance.length > 0) {
						const lastfmURL = 'http://ws.audioscrobbler.com/2.0/?method=artist.gettoptags&artist=' + event.performance[0].displayName + '&api_key=' + APIkeys.lastfm + '&format=json';
						return fetch(lastfmURL)
							.then(response => {
								if (response.status !== 200) {
									console.log('Looks like there was a problem. Status Code: ' + response.status);
									return;
								} else return response.json();
							});
					}
				});
				return Promise.all(artists);
			}).then(dataSet => {
				const cleanDataSet = dataSet.filter(data => {
					if (data === undefined) {
						return false;
					} else if (data.error) {
						return false
					} else return true;
				});
				
				const tagStats = {};
				cleanDataSet.forEach(data => {
					data.toptags.tag.forEach(genre => {
						if(tagStats[genre.name] === undefined) {
							tagStats[genre.name] = 1;
						} else {
							tagStats[genre.name]++;
						}
					});
				})
				console.log(tagStats);
			});		
	}


	render() {
		return (
			<div className="App">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
				
				</header>
				<SeekZone 
					locationSearch={this.locationSearch}
				/>
				{/* <DataViz /> */}
			</div>
		);
	}
}

export default App;
