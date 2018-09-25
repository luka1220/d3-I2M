import React, { Component } from 'react';


class Navigation extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataRange: props.dataRange,
		}
	}

	handleOnClickNextIdeas = (e) => {
		this.props.updateDataRange(10)
	}
	handleOnClickPrevIdeas = (e) => {
		this.props.updateDataRange(-10)
	}

	renderDropdownSelectData(title, i) {
	  return (
	     <select onClick={this.props.handleDataSelect}>
		  <option value={0}>CHI19S1-ideas</option>
		  <option value={1}>CHI19S2-ideas</option>
		  <option value={2}>CHI19S3-ideas</option>
		</select> 
	  );
	}

	

	render() {
		const selectInstance = this.renderDropdownSelectData("dropdown", 1)
    	return (
    		<div className="">
	    		{(selectInstance)? selectInstance:null}
	    		
    			<button type="button" className="btn btn-light" onClick={this.handleOnClickPrevIdeas} >Show previous 10 Ideas</button>
    			<button type="button" className="btn btn-dark" onClick={this.handleOnClickNextIdeas} >Show next 10 Ideas</button>
    		</div>
    		)
    }
}

export default Navigation;