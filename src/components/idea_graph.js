
import Navigation from "./navigation";

import JSON_DATA from '../CHI19S1-ideas.json';
import "./graph.css";
import { textwrap } from 'd3-textwrap';
const React = require('react');
var d3 = require("d3");



class Graph extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			startPoint: {x:30, y:60},
			dataRange: {fromIndex: 0, toIndex:10},
			circleRadius: "20px"
		}
		this.setgraph = this.setgraph.bind(this)
	}

	componentDidMount() {
		
		var data = this.dataHandler(this.state.dataRange)
		this.setgraph(data.nodes, data.links)
		this.setgraph(data.conzeptNodes, [])
	}

	componentDidUpdate(prevProps, prevState, snapshot){
		if(prevState.dataRange !== this.state.dataRange){
			d3.selectAll("g").remove(); 

			var data = this.dataHandler(this.state.dataRange)
			this.setgraph(data.nodes, data.links)
			this.setgraph(data.conzeptNodes, [])
		}
	}

	dataHandler = (dataRange) => {
		const data = JSON_DATA.slice(dataRange.fromIndex,dataRange.toIndex); 
		console.log(data)
		var processedData = []
		const startPoint = this.state.startPoint
		processedData = data.map((idea,i)=>{
			var ideaObj = {
				x: startPoint.x + (i*100),
				y: startPoint.y,
				description: idea.description,
				label: idea.id,
				color: "green"
			}

			return ideaObj; 
		})
		var links = processedData.map((idea, i, arr)=>{
			if(i<arr.length-1) return {source: idea, target: arr[i+1]}
			else return {source: idea, target:idea}
		})

		var conzeptsData = []
		data.forEach((idea, i)=>{
			var conzepts = idea.validatedConcepts.map((conz,i2)=>{
				return {
					x: startPoint.x+(i*100),
					y: startPoint.y+(i2*50)+60,
					label:conz.token,
					color:"yellow"
				}
			})
			conzeptsData = conzeptsData.concat(conzepts)
		})

		return {nodes:processedData, links:links, conzeptNodes: conzeptsData}; 

	}

	handleMouseOver = (d,i) => {
		const node = this.node;
		console.log(d,i)

		var textnode = d3.select(node)
		.append("text")
		.attr("dx", d.x)
		.attr("dy",  d.y-30)
		.attr("id", "t" + i + "-" + d.x + "-" + d.y)
		.attr("text-anchor","middle")
		.text(function() { return d.description; })
		.style("fill","red");

		var wrap = textwrap()
		.bounds({height: 480, width: 500})
		.method('tspans');

		//textnode.call(wrap)
	}
	handleMouseOut = (d, i) => {
		d3.select("#t"+ i + "-" + d.x + "-" + d.y).remove(); 
	}
	setIdeaNodes(nodes, elemEnter){
		if(nodes[0].description){
			elemEnter
			.on("mouseover", this.handleMouseOver)
			.on("mouseout", this.handleMouseOut)
		}
	}

	setNodes(nodes, place){

		const { circleRadius } = this.state; 

		var elem = d3.select(place)
	    	.selectAll('rect')
		   .data(nodes)
		   
		var elemEnter = elem.enter()
			.append("g")
        	//.attr("transform", function(d){return "translate("+d.x+",80)"})

		var circle = elemEnter.append("svg:circle")
		   .attr("cx", function(d) { return d.x; })
		   .attr("cy", function(d) { return d.y; })
		   .attr("r", circleRadius)
		   .attr("fill", function(d) { return d.color; })

		this.setIdeaNodes(nodes, elemEnter) 

		var text = elemEnter.append("text")
			.attr("dx", function(d){return d.x})
			.attr("dy", function(d){return d.y})
			.attr("text-anchor","middle")
        	.text(function(d){return d.label})
	}

	setLinks(links, place){
		d3.select(place)
		.selectAll('rect')
		   .data(links)
		   .enter()
		   .append("line")
		   .attr("x1", function(d) { return d.source.x })
		   .attr("y1", function(d) { return d.source.y })
		   .attr("x2", function(d) { return d.target.x })
		   .attr("y2", function(d) { return d.target.y })
		   .style("stroke", "rgb(6,120,155)");
	}

	setgraph(nodes, links) {
		const node = this.node;

		this.setNodes(nodes, node)
		this.setLinks(links, node)
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

	render(){
		console.log(this.state.dataRange)
	      	return (
	      		<div>
	      			<Navigation updateDataRange={this.updateDataRange}/>
		      		<svg ref={node => this.node = node}
					    width={window.innerWidth} height={500}>
					</svg>
				</div>
				   )
	}
}

export default Graph;
