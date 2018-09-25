import React, { Component } from 'react';
import { textwrapReact } from './textwraper';

class EventNode extends Component {
	constructor(props){
		super(props)
		this.state = {
			showEvent: false
		}
	}

	handleOnClick = (e) => {
		console.log(e.target)
		this.setState((prevState)=>{
			return {showEvent: !prevState.showEvent}
		})
	}

	renderInfo = (node) => {
		if(node.type==="idea-submit"){
			return <Idea x={node.x} y={node.y} idea={node.idea}/>;
		} else {
			return <Inspiration x={node.x} y={node.y} ideas={node.ideas}/>
		}
	}

	render(){
		const {
			x, y, type, idea, ideas, timerValue
			} = this.props.node
		var content = null
		if(this.state.showEvent){
			content = this.renderInfo(this.props.node)
		}

		return(
			<g onClick={this.handleOnClick}>
				{content}
				<circle cx={x} cy={y} r={30} stroke="#FFF099" strokeWidth="3" fill="#35ba57" />
				<text dx={x} dy={y} textAnchor="middle">{timerValue}</text>
			</g>
		)
	}
}

function Idea(props){ 
	const { idea, x, y } = props
	console.log(props)
	const lines = textwrapReact(idea.description, 200)
	const ideaBox = makeTextBox(lines, x-100)

	return <text dx={x-100} dy={y-100} textAnchor="start">{ideaBox}</text>
}
function Inspiration(props){
	const {x, y, ideas} = props
	const ideasBox = props.ideas.map((idea, i) => <Idea key={i} x={x+200*i} y={y} idea={idea}/>)
	return <g>{ideasBox}</g>
}

function ConzeptNode(props){
	const {
		x, y, label, uri, color
	} = props.node; 

	var lines = textwrapReact(label, props.width)
	var labelResult = makeTextBox(lines, x)

	return(
		<g>
			<circle cx={x} cy={y} r={props.width/2} stroke="#FFF099" strokeWidth="3" fill={color} />
			<text dx={x} dy={y} textAnchor="middle">{labelResult}</text>
		</g>
	)
}

function makeTextBox(lines, x){
	return lines.map((line,i)=>{
		if(i===0){
			return <tspan key={i} x={0}>{line}</tspan>
		} else{
			return <tspan key={i} x={x} dy={"1.1em"}>{line}</tspan>
		}
	})
}

export { ConzeptNode, EventNode }
