import React, { Component } from 'react';
import Navigation from "./navigation";

import CHI19S1_ideas from '../CHI19S1-ideas.json';
import CHI19S2_ideas from '../CHI19S2-ideas.json';
import CHI19S3_ideas from '../CHI19S3-ideas.json';
import Session_Data from "../session-data-37M28K1J0RKP5PMSMANDKTWN2G2AJM.json";

import "./graph.css";
import { wrap } from './textwraper'; 
import { unique } from '../utils/unique'; 
import { EventNode, ConzeptNode } from './node'; 

var colorDictionary = new Map(); 

const DATA_Array = [CHI19S1_ideas, CHI19S2_ideas, CHI19S3_ideas]

class Session extends Component {

	constructor(props) {
		super(props);
		this.state = {
			JSON_DATA: CHI19S1_ideas,
			data: null,
			startPoint: {x:parseInt(300, 10), y:200},
			dataRange: {fromIndex: 0, toIndex:10},
			circleRadius: "3%",
			nodeSpace: {x: parseInt(window.innerWidth*0.67/20, 10), y:100},
			conzept: {uri: undefined},
			windowWidth: "100%",
			windowHeight: 900,
			color: {
				back: "#73c487",
				text: "#210000",
				idea: "#35ba57",
				conzept: "#ddb31a",
				hover: "#91a596"}
		}
	}

	componentDidMount() {
		const {startPoint, nodeSpace} = this.state
		var conzeptLabels, eventNodes, conzeptMap;
		const events = Session_Data[0].events.sort((a,b)=>{return a.timerValue - b.timerValue  })
		
		conzeptMap = this.conzeptDataMap(events)
		var conzepts = [...conzeptMap.entries()]
		conzepts = conzepts.sort((a,b)=>{return b[1]-a[1]})
		conzeptMap = this.generateSortedMap(conzepts)

		

		this.setState({
			windowWidth: events.length * nodeSpace.x + startPoint.x * 2,
			windowHeight: conzepts.length * 20 + startPoint.y + nodeSpace.y,
			conzeptMap: conzeptMap,
			events: events
		})
	}

	conzeptDataMap = (events) => {
		var conzeptMap = new Map()
		events.forEach((event)=>{
			if(event.type==="idea-submit"){
				event.idea.validatedConcepts.forEach(conz=>{
					var val = conzeptMap.get(conz.uri)
					if(val){
						conzeptMap.set(conz.uri, val+1)
					} else {
						conzeptMap.set(conz.uri, 1)
					}
				})
			} else if(event.type==="inspiration"){
				event.ideas.forEach(idea=>{
					idea.conceptMentions.forEach(conz=>{
						var val = conzeptMap.get(conz.selectedConceptURI)
						if(val){
							conzeptMap.set(conz.selectedConceptURI, val+1)
						} else {
							conzeptMap.set(conz.selectedConceptURI, 1)
						}
					})
				})
			}
		})
		return conzeptMap; 
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

	renderConzeptNodes(events){
		const { 
			circleRadius,
			nodeSpace,
			startPoint, 
			conzeptMap
			} = this.state; 
		var conzeptNodes = []
		events.forEach((event, i)=>{
			var conzeptsOfEvent 
			if(event.type==="idea-submit"){
				conzeptsOfEvent = event.idea.validatedConcepts.map((conz, i)=>{
					conz.position = conzeptMap.get(conz.uri).position
					conz.color =  conzeptMap.get(conz.uri).color
					return conz
				}).sort((a,b)=>{return b.position-a.position})
			} else if(event.type==="inspiration") {
				var conzepts = []
				event.ideas.forEach(idea=>{conzepts = conzepts.concat(idea.conceptMentions)})
				conzepts = unique(conzepts); 
				conzeptsOfEvent = conzepts.map((conz, i)=>{
					conz.position = conzeptMap.get(conz.selectedConceptURI).position
					conz.color =  conzeptMap.get(conz.selectedConceptURI).color
					return conz
				}).sort((a,b)=>{return b.position-a.position})
			}
			var nodes = conzeptsOfEvent.map((conz,j)=>{
					conz.x = startPoint.x + (i*nodeSpace.x)
					conz.y = startPoint.y + (j*nodeSpace.y)
					return <ConzeptNode key={conz.x+"-"+conz.y} node={conz} width={nodeSpace.x}/>
				})
			conzeptNodes = conzeptNodes.concat(nodes)
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

	renderConzeptLabels(conzepts){
		return conzepts.map((conzept,i)=>{
			var label = conzept[0].split("/").pop()
			return (
				<text key={i} x={10} dy={this.state.startPoint.y + 30 + i*20}>{label + " " + conzept[1].frequency}</text>
				)
		})
	}

	generateSortedMap(conzepts){
		var conzeptMap = new Map()
		conzepts.forEach((entrie, i)=>{
			conzeptMap.set(entrie[0], {frequency: entrie[1], position: i, color: this.getColorFromDic(entrie[0])})
		})
		return conzeptMap;
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
				data, events, nodeSpace, startPoint, windowWidth, windowHeight, conzeptMap } = this.state; 
		var conzeptLabels, conzeptNodes, eventNodes = null; 
		if(events){
			conzeptLabels = this.renderConzeptLabels([...conzeptMap.entries()])
			eventNodes = this.renderEventNodes(events)
			//conzeptNodes = this.renderConzeptNodes(events)
		}

      	return (
      		<div className="">
      			<div className="row">
	      			<div className="col-12">
		      			<svg ref={node => this.node = node}
						    width={windowWidth} height={windowHeight}>
						    {conzeptLabels}
						    {eventNodes}
						    {conzeptNodes}
						</svg>
	      			</div>
				</div>
			</div> 
			   )
	}
}

export default Session; 