import React, { Component } from 'react';
import Navigation from "./navigation";

import CHI19S1_ideas from '../CHI19S1-ideas.json';
import CHI19S2_ideas from '../CHI19S2-ideas.json';
import CHI19S3_ideas from '../CHI19S3-ideas.json';
import Session_Data from "../session-data-37M28K1J0RKP5PMSMANDKTWN2G2AJM.json";
import SessionData_withSuperClasses from "../session-data-37M28K1J0RKP5PMSMANDKTWN2G2AJM-superclasses.json"

import "../css/graph.css";
import { uniqueUnion } from '../utils/unique'; 
import { EventNode, ConzeptNode } from './node'; 
import { SideBar } from './sideBar'
import { Axes } from './axes'

var colorDictionary = new Map(); 
const DATA_Array = [CHI19S1_ideas, CHI19S2_ideas, CHI19S3_ideas]
const nodeSpace = parseInt(window.innerWidth/50, 10); 
const startP = parseInt(window.innerWidth/6+150, 10); 


class Session extends Component {

	constructor(props) {
		super(props);
		this.state = {
			JSON_DATA: CHI19S1_ideas,
			data: null,
			timerEndPoint: 0,
			startPoint: {x:parseInt(startP, 10), y:200},
			nodeSpace: {x: nodeSpace, y:nodeSpace},
			conzept: {uri: undefined},
			windowWidth: "100%",
			windowHeight: "100%",
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
		const events = SessionData_withSuperClasses[0].events.sort((a,b)=>{return b.timerValue - a.timerValue  })
		
		conzeptMap = this.conzeptDataMap(events)
		var conzepts = [...conzeptMap.entries()]
		conzepts = conzepts.sort((a,b)=>{return b[1].frequency-a[1].frequency})
		conzeptMap = this.generateSortedMap(conzepts)


		

		this.setState({
			windowWidth: events[0].timerValue * 3 + startPoint.x * 2,
			windowHeight: conzepts.length * nodeSpace.y/2 + startPoint.y*2,
			conzeptMap: conzeptMap,
			events: events,
			timerEndPoint: events[0].timerValue * 3
		})
	}

	conzeptDataMap = (events) => {
		var conzeptMap = new Map()
		var uri, concepts 
		events.forEach((event)=>{
			if(event.type==="idea-submit"){
				concepts = (event.idea.validatedConcepts)? "validatedConcepts" : "superclasses"
				event.idea[concepts].forEach(conz=>{
					uri = conz.uri
					var val = conzeptMap.get(uri)
					if(val){
						val.frequency = val.frequency+1
						conzeptMap.set(uri, val)
					} else {
						conzeptMap.set(uri, {frequency:1, token: conz.token})
					}
				})
			} else if(event.type==="inspiration"){
				concepts = (event.ideas[0].conceptMentions)? "validatedConcepts" : "superclasses"
				event.ideas.forEach(idea=>{
					idea[concepts].forEach(conz=>{
						uri = (conz.selectedConceptURI)? conz.selectedConceptURI : conz.uri
						var val = conzeptMap.get(uri)
						if(val){
							val.frequency = val.frequency+1
							conzeptMap.set(uri, val)
						} else {
							conzeptMap.set(uri, {frequency:1, token: conz.token})
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
		var conzeptNodes = [],
			concepts,
			uri
		events.forEach((event, i)=>{
			var conzeptsOfEvent 
			if(event.type==="idea-submit"){
				concepts = (event.idea.validatedConcepts)? "validatedConcepts" : "superclasses"
				conzeptsOfEvent = event.idea[concepts].map((conz, i)=>{
					uri = conz.uri
					conz.position = conzeptMap.get(uri).position
					conz.color =  conzeptMap.get(uri).color
					conz.name = uri.split("/").pop()
					return conz
				}).sort((a,b)=>{return a.position-b.position})
			} else if(event.type==="inspiration") {
				concepts = (event.ideas[0].conceptMentions)? "validatedConcepts" : "superclasses"
				var conzepts = []
				event.ideas.forEach(idea=>{conzepts = uniqueUnion(conzepts,idea[concepts])})
				conzeptsOfEvent = conzepts.map((conz, i)=>{
					uri = (conz.selectedConceptURI)? conz.selectedConceptURI : conz.uri
					conz.position = conzeptMap.get(uri).position
					conz.color =  conzeptMap.get(uri).color
					conz.name = uri.split("/").pop()
					return conz
				}).sort((a,b)=>{return a.position-b.position})
			}
			var nodes = conzeptsOfEvent.map((conz,j)=>{
					conz.x = startPoint.x + (timerEndPoint - event.timerValue*3)
					conz.y = startPoint.y + nodeSpace.y + (conz.position*nodeSpace.y)
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
			return <EventNode key={node.x+"-"+node.y} node={node} width={nodeSpace.x} i={i}/>
		})
		return eventNodes; 
	}

	generateSortedMap(conzepts){
		var conzeptMap = new Map()
		conzepts.forEach((entrie, i)=>{
			conzeptMap.set(entrie[0], {token: entrie[1].token ,frequency: entrie[1].frequency, position: i, color: this.getColorFromDic(entrie[0])})
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
			conzeptLabels = [...conzeptMap.entries()]
			eventNodes = this.renderEventNodes(events)
			conzeptNodes = this.renderConzeptNodes(events)
		}

      	return (
      		<div className="">
      			<div className="row ">
      				<div className="col-2 sidebar">
	      				<SideBar conzepts={conzeptLabels} height={nodeSpace.y} />
	      			</div>
	      			<div className="col-12 visContainer">
		      			<svg ref={node => this.node = node}
						    width={windowWidth} height={windowHeight}>
						    <Axes startPoint={startPoint} timerEndPoint={timerEndPoint} interval={50}/>
							
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