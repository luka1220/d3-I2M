import React, { Component } from 'react';
import Navigation from "./navigation";

import CHI19S1_ideas from '../CHI19S1-ideas.json';
import CHI19S2_ideas from '../CHI19S2-ideas.json';
import CHI19S3_ideas from '../CHI19S3-ideas.json';
import Session_Data from "../session-data-37M28K1J0RKP5PMSMANDKTWN2G2AJM.json";

import "./graph.css";
import { uniqueUnion } from '../utils/unique'; 
import { EventNode, ConzeptNode } from './node'; 

var colorDictionary = new Map(); 

const DATA_Array = [CHI19S1_ideas, CHI19S2_ideas, CHI19S3_ideas]

const nodeSpace = parseInt(window.innerWidth/20, 10); 

class Session extends Component {

	constructor(props) {
		super(props);
		this.state = {
			JSON_DATA: CHI19S1_ideas,
			data: null,
			timerEndPoint: 0,
			startPoint: {x:parseInt(300, 10), y:200},
			nodeSpace: {x: nodeSpace, y:nodeSpace},
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
		const events = Session_Data[0].events.sort((a,b)=>{return b.timerValue - a.timerValue  })
		
		conzeptMap = this.conzeptDataMap(events)
		var conzepts = [...conzeptMap.entries()]
		conzepts = conzepts.sort((a,b)=>{return b[1]-a[1]})
		conzeptMap = this.generateSortedMap(conzepts)

		

		this.setState({
			windowWidth: events[0].timerValue * 3 + startPoint.x * 2,
			windowHeight: conzepts.length * 20 + startPoint.y + nodeSpace.y,
			conzeptMap: conzeptMap,
			events: events,
			timerEndPoint: events[0].timerValue * 3
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
			conzeptMap,
			timerEndPoint
			} = this.state; 
		var conzeptNodes = []
		events.forEach((event, i)=>{
			var conzeptsOfEvent 
			if(event.type==="idea-submit"){
				conzeptsOfEvent = event.idea.validatedConcepts.map((conz, i)=>{
					conz.position = conzeptMap.get(conz.uri).position
					conz.color =  conzeptMap.get(conz.uri).color
					conz.name = conz.uri.split("/").pop()
					return conz
				}).sort((a,b)=>{return a.position-b.position})
			} else if(event.type==="inspiration") {
				var conzepts = []
				event.ideas.forEach(idea=>{conzepts = uniqueUnion(conzepts,idea.conceptMentions)})
				conzeptsOfEvent = conzepts.map((conz, i)=>{
					conz.position = conzeptMap.get(conz.selectedConceptURI).position
					conz.color =  conzeptMap.get(conz.selectedConceptURI).color
					conz.name = conz.selectedConceptURI.split("/").pop()
					return conz
				}).sort((a,b)=>{return a.position-b.position})
			}
			var nodes = conzeptsOfEvent.map((conz,j)=>{
					conz.x = startPoint.x + (timerEndPoint - event.timerValue*3)
					conz.y = startPoint.y + nodeSpace.y + (j*nodeSpace.y)
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
			timerEndPoint
			} = this.state; 

		const eventNodes = nodes.map((node, i)=>{
			node.x = startPoint.x + (timerEndPoint-node.timerValue*3)
			node.y = startPoint.y
			return <EventNode key={node.x+"-"+node.y} node={node} width={nodeSpace.x}/>
		})
		return eventNodes; 
	}

	renderConzeptLabels(conzepts){
		return conzepts.map((conzept,i)=>{
			var label = conzept[0].split("/").pop()
			return (
				<text key={i} x={10} dy={this.state.startPoint.y + this.state.nodeSpace.y + i*20}>{label + " " + conzept[1].frequency}</text>
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
				data, events, nodeSpace,
				startPoint, timerEndPoint, windowWidth,
				windowHeight, conzeptMap } = this.state; 
		var conzeptLabels, conzeptNodes, eventNodes = null; 
		if(events){
			conzeptLabels = this.renderConzeptLabels([...conzeptMap.entries()])
			eventNodes = this.renderEventNodes(events)
			conzeptNodes = this.renderConzeptNodes(events)
		}

      	return (
      		<div className="">
      			<div className="row">
	      			<div className="col-12">
		      			<svg ref={node => this.node = node}
						    width={windowWidth} height={windowHeight}>
						    <line x1={startPoint.x} y1={startPoint.y} 
								x2={timerEndPoint+startPoint.x} y2={startPoint.y}
								stroke="black" strokeWidth={5} />
						    <g>
							    <rect x={0} y={startPoint.y-20} width={150} height={40} fill={this.state.color.idea}></rect>
								<text x={10} dy={startPoint.y}>Events:</text>

						    </g>
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