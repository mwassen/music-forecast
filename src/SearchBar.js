import React, { Component } from 'react';

class SearchBar extends Component {
	constructor(props) {
		super(props);
		this.handleSearchBarChange = this.handleSearchBarChange.bind(this);
	}

	handleSearchBarChange(event) {
		this.props.onSearchTextChange(event.target.value);
	}
	
	render() {
		return (
			<div>
				<input type="text" placeholder="Select location..." value={this.props.searchText} onChange={this.handleSearchBarChange}></input>
			</div>
		);
	}
}

export default SearchBar;