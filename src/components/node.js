import React, { Component } from 'react';
import { textwrapReact } from '../utils/textwraper';

class EventNode extends Component {
	constructor(props){
		super(props)
		this.state = {
			showEvent: false
		}
	}

	handleOnMouseEvent = (e) => {
		this.setState((prevState)=>{
			return {showEvent: !prevState.showEvent}
		})
	}

	renderInfo = (node, color) => {
		if(node.type==="idea-submit"){
			return <Idea x={Math.max(node.x-140, 10)} y={node.y} idea={node.idea} color={color}/>;
		} else {
			return <Inspiration x={node.x} y={node.y} ideas={node.ideas} color={color}/>
		}
	}

	render(){
		const {
			x, y, type, idea, ideas, timerValue
			} = this.props.node
		var content = null
		var color = "#35ba57"
		if(type!=="idea-submit"){
			color = "#f7dd18"
		}
		if(this.state.showEvent){
			content = this.renderInfo(this.props.node, color)
		}

		return(
			<g onMouseEnter={this.handleOnMouseEvent} onMouseLeave={this.handleOnMouseEvent}>
				{content}
				<circle cx={x} cy={y} r={this.props.width/2} stroke="#FFF099" strokeWidth="3" fill={color} />
				<text dx={x} dy={y} textAnchor="middle">{timerValue}</text>
			</g>
		)
	}
}

function Idea(props){ 
	const { idea, x, y, color} = props
	console.log(props)
	const lines = textwrapReact(idea.description, 280)
	const ideaBox = makeTextBox(lines, x+10)

	return (<g>
			<rect x={x} dy={y-150} width={300} height={150} fill={color} ></rect>
			<text dx={x+10} dy={y-170} textAnchor="start">{ideaBox}</text>
			</g>)
}
function Inspiration(props){
	const {x, y, ideas, color} = props
	const ideasBox = props.ideas.map((idea, i) => <Idea key={i} x={Math.max(x-440, 10)+(300*i)} y={y} idea={idea} color={color} />)
	return <g>{ideasBox}</g>
}

function ConzeptNode(props){
	const {
		x, y, label, name, token, color
	} = props.node; 

	var lines = textwrapReact(name, props.width)
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
