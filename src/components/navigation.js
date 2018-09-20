import React, { Component } from 'react';

class Navigation extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataRange: props.dataRange
		}
	}

	handleOnClickNextIdeas = (e) => {
		this.props.updateDataRange(10)
	}
	handleOnClickPrevIdeas = (e) => {
		this.props.updateDataRange(-10)
	}

	render() {
    	return (
    		<div className="float-right">
    			<button type="button" className="btn btn-light" onClick={this.handleOnClickPrevIdeas} >Show previous 10 Ideas</button>
    			<button type="button" className="btn btn-dark" onClick={this.handleOnClickNextIdeas} >Show next 10 Ideas</button>
    		</div>
    		)
    }
}

export default Navigation;