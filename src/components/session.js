import React, { Component } from 'react';
import Navigation from "./navigation";

import CHI19S1_ideas from '../CHI19S1-ideas.json';
import CHI19S2_ideas from '../CHI19S2-ideas.json';
import CHI19S3_ideas from '../CHI19S3-ideas.json';
import Session_Data from "../session-data-37M28K1J0RKP5PMSMANDKTWN2G2AJM.json";

import "./graph.css";
import { wrap } from './textwraper'; 
import { EventNode, ConzeptNode } from './node'; 

var colorDictionary = new Map(); 

const DATA_Array = [CHI19S1_ideas, CHI19S2_ideas, CHI19S3_ideas]

class Session extends Component {

	constructor(props) {
		super(props);
		this.state = {
			JSON_DATA: CHI19S1_ideas,
			data: null,
			startPoint: {x:parseInt(window.innerWidth*0.67/12, 10), y:200},
			dataRange: {fromIndex: 0, toIndex:10},
			circleRadius: "3%",
			nodeSpace: {x: parseInt(window.innerWidth*0.67/12, 10), y:100},
			conzept: {uri: undefined},
			color: {
				back: "#73c487",
				text: "#210000",
				idea: "#35ba57",
				conzept: "#ddb31a",
				hover: "#91a596"}
		}
	}

	componentDidMount() {
		var data = this.dataHandler(this.state.dataRange, this.state.JSON_DATA)
		const session_Data = Session_Data[0].events.sort((a,b)=>{return a.timerValue - b.timerValue  })
		
		this.setState({
			data: data,
			session_Data: session_Data
		})
	}

	componentDidUpdate(prevProps, prevState, snapshot){
		if(prevState.dataRange !== this.state.dataRange || prevState.JSON_DATA!==this.state.JSON_DATA){

			var data = this.dataHandler(this.state.dataRange, this.state.JSON_DATA)
			this.setState({
			data: data
			})
		}
	}

	dataHandler = (dataRange, JSON_DATA) => {
		const data = JSON_DATA.slice(dataRange.fromIndex,dataRange.toIndex); 
		console.log(data)
		var processedData = []
		const {
			startPoint,
			color,
			nodeSpace 
			} = this.state

		processedData = data.map((idea,i)=>{
			return {
				x: startPoint.x + (i*nodeSpace.x),
				y: startPoint.y,
				description: idea.description,
				label: idea.id,
				color: color.idea
			}
		})
		var links = processedData.map((idea, i, arr)=>{
			if(i<arr.length-1) return {source: idea, target: arr[i+1]}
			else return {source: idea, target:idea}
		})

		var conzeptsData = []
		data.forEach((idea, i)=>{
			var conzepts = idea
				.validatedConcepts
				.sort((a,b)=>{return (a.uri<b.uri)? -1: (a.uri>b.uri)? 1:0})
				.map((conz,i2)=>{
				var colorDic = this.getColorFromDic(conz.uri) 
				return {
					x: startPoint.x+(i*nodeSpace.x),
					y: startPoint.y+(i2*nodeSpace.y)+nodeSpace.y,
					label:conz.token,
					uri: conz.uri,
					color:colorDic
				}
			})
			conzeptsData = conzeptsData.concat(conzepts)
		})
		return {ideaNodes:processedData, links:links, conzeptNodes: conzeptsData}; 

	}
	getColorFromDic(uri){
		if(colorDictionary.get(uri)){

		} else{
			let color = 'rgb(' + (Math.floor(Math.random() * 206)+50) + ',' + (Math.floor(Math.random() * 206)+50) + ',' + (Math.floor(Math.random() * 206)+50) + ')';
			colorDictionary.set(uri, color)	//"#"+((1<<24)*Math.random()|0).toString(16)
		} 
		return colorDictionary.get(uri)
	}

	renderConzeptNodes(nodes){
		const { 
			circleRadius,
			nodeSpace 
			} = this.state; 

		const conzeptNodes = nodes.map((node, i)=>{
			return <ConzeptNode key={node.x+"-"+node.y} node={node} width={nodeSpace.x}/>
		})
		return conzeptNodes; 
	}

	renderEventNodes(nodes){
		const { 
			circleRadius,
			nodeSpace, 
			startPoint,
			} = this.state; 

		const eventNodes = nodes.map((node, i)=>{
			node.x = startPoint.x + (i*nodeSpace.x)
			node.y = startPoint.y
			return <EventNode key={node.x+"-"+node.y} node={node} width={nodeSpace.x}/>
		})
		return eventNodes; 
	}

	updateDataRange = (number) => {
		console.log(number)
		if(number>0 || this.state.dataRange.fromIndex+number>=0){
			this.setState((state,props) => {
				return {
					dataRange: {
						fromIndex: state.dataRange.fromIndex + number,
						toIndex: state.dataRange.toIndex + number
					}
				};
			})
		}
	}

	handleDataSelect = (e) => {
		console.log(e.target.value)
		var index = e.target.value; 
		this.setState({
			JSON_DATA: DATA_Array[index],
			dataRange: {fromIndex:0, toIndex:10}
		})
	}

	render(){
		console.log(this.state.dataRange)
		const {conzept, 
				data, session_Data } = this.state; 
		var ideaNodes, conzeptNodes, eventNodes;

		if(session_Data){
			console.log(session_Data)
			eventNodes = this.renderEventNodes(session_Data)
		}
		/*if(data){
			conzeptNodes = this.renderConzeptNodes(data.conzeptNodes)
			ideaNodes = this.renderIdeaNodes(data.ideaNodes)
		} */
	      	return (
	      		<div className="">
	      			<Navigation className="" handleDataSelect={this.handleDataSelect} updateDataRange={this.updateDataRange}/>
	      			<div className="row">
		      			<div className="col-8">
			      			<svg ref={node => this.node = node}
							    width="100%" height={1000}>
							    {conzeptNodes}
							    {ideaNodes}
							    {eventNodes}
							</svg>
		      			</div>
					</div>
				</div> 
				   )
	}
}

export default Session; 