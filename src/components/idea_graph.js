
import Navigation from "./navigation";

import CHI19S1_ideas from '../CHI19S1-ideas.json';
import CHI19S2_ideas from '../CHI19S2-ideas.json';
import CHI19S3_ideas from '../CHI19S3-ideas.json';


import "./graph.css";
import { textwrap } from 'd3-textwrap';
import { wrap } from '../utils/textwraper'; 
const React = require('react');
var d3 = require("d3");
var colorDictionary = new Map(); 

const DATA_Array = [CHI19S1_ideas, CHI19S2_ideas, CHI19S3_ideas]

class Graph extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			JSON_DATA: CHI19S1_ideas,
			startPoint: {x:parseInt(window.innerWidth*0.67/12, 10), y:200},
			dataRange: {fromIndex: 0, toIndex:10},
			circleRadius: "3%",
			nodeSpace: {x: parseInt(window.innerWidth*0.67/12, 10), y:70},
			conzept: {uri: undefined},
			color: {
				back: "#73c487",
				text: "#210000",
				idea: "#35ba57",
				conzept: "#ddb31a",
				hover: "#91a596"}
		}
		this.setgraph = this.setgraph.bind(this)
	}

	componentDidMount() {
		
		var data = this.dataHandler(this.state.dataRange, this.state.JSON_DATA)
		this.setgraph(data.nodes, data.links)
		this.setgraph(data.conzeptNodes, [])
	}

	componentDidUpdate(prevProps, prevState, snapshot){
		if(prevState.dataRange !== this.state.dataRange || prevState.JSON_DATA!==this.state.JSON_DATA){
			d3.selectAll("g").remove(); 
			d3.select("#r-link").remove(); //remove rect
			d3.select("#t-link").remove(); //remove text link uri

			var data = this.dataHandler(this.state.dataRange, this.state.JSON_DATA)
			this.setgraph(data.nodes, data.links)
			this.setgraph(data.conzeptNodes, [])
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
			var ideaObj = {
				x: startPoint.x + (i*nodeSpace.x),
				y: startPoint.y,
				description: idea.description,
				label: idea.id,
				color: color.idea
			}

			return ideaObj; 
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
		return {nodes:processedData, links:links, conzeptNodes: conzeptsData}; 

	}
	getColorFromDic(uri){
		if(colorDictionary.get(uri)){

		} else{
			let color = 'rgb(' + (Math.floor(Math.random() * 206)+50) + ',' + (Math.floor(Math.random() * 206)+50) + ',' + (Math.floor(Math.random() * 206)+50) + ')';
			colorDictionary.set(uri, color)	//"#"+((1<<24)*Math.random()|0).toString(16)
		} 
		return colorDictionary.get(uri)
	}

	handleMouseOver = (d,i) => {
		const node = this.node;
		console.log(d,i)

		const { color } =this.state; 

		var rect = d3.select(node)
		.append("rect")
		.attr("x", Math.max(d.x-100,0))
		.attr("dy",  d.y-150)
		.attr("width", 220)
		.attr("height", 130)
		.attr("fill", color.back)
		.attr("id", "r" + i + "-" + d.x + "-" + d.y)

		var textnode = d3.select(node)
		.append("text")
		.attr("dx", Math.max(d.x-90,10))
		.attr("dy",  d.y-180)
		.attr("id", "t" + i + "-" + d.x + "-" + d.y)
		.attr("text-anchor","start")
		.text(function() { return d.description; })
		.style("fill", color.text);

		//var wrap = textwrap()
		//.bounds({height: 480, width: 500})
		//.method('tspans');
		wrap(textnode, 200)
	}
	handleMouseOut = (d, i) => {
		d3.select("#t"+ i + "-" + d.x + "-" + d.y).remove(); //remove idea text
		d3.select("#r"+ i + "-" + d.x + "-" + d.y).remove(); //remove rect
	}

	handleOnClickConzeptNode = (d, i) => {

		//d3.select("#r-link").remove(); //remove rect
		//d3.select("#t-link").remove();
		//d3.select(".iframe").remove();

		const node = this.node
		const { color,
				circleRadius } = this.state
		var uriLink = d.uri
		var width = uriLink.length; 

		console.log(this)
		/*d3.select(this)
		.attr({
              fill: "orange",
              r: circleRadius * 2
            }); 
            */
		/*var rect = d3.select(node)
		.append("rect")
		.attr("x", d.x+20)
		.attr("y",  d.y-20)
		.attr("width", width * 10)
		.attr("height", 30)
		.attr("fill", color.back)
		.attr("id", "r-link")

		var textnode = d3.select(node)
		.append("text")
		.attr("dx", d.x+30)
		.attr("dy",  d.y)
		.attr("id", "t-link")
		.attr("text-anchor","start")
		.append("a")
		.attr("xlink:href", uriLink)
		.style("fill", color.text)
		.text(uriLink);
		*/

		this.setState({
			conzept: {uri: uriLink}
		})

	}
	setInfoOnNodes(nodes, elemEnter){
		if(nodes[0].description){
			elemEnter
			.on("mouseover", this.handleMouseOver)
			.on("mouseout", this.handleMouseOut)
		} else {
			elemEnter.
			on("click", this.handleOnClickConzeptNode)
		}
	}

	setNodes(nodes, place){

		const { circleRadius,
				nodeSpace } = this.state; 

		var elem = d3.select(place)
	    	.selectAll('rect')
		   .data(nodes)
		   
		var elemEnter = elem.enter()
			.append("g")
        	
		var circle = elemEnter.append("svg:circle")
		   .attr("cx", function(d) { return d.x; })
		   .attr("cy", function(d) { return d.y; })
		   .attr("r", circleRadius)
		   .attr("fill", function(d) { return d.color; })

		this.setInfoOnNodes(nodes, elemEnter) 

		var text = elemEnter.append("text")
			.attr("dx", function(d){return d.x})
			.attr("dy", function(d){return d.y})
			.attr("text-anchor","middle")
        	.text(function(d){return d.label})

        wrap(text, nodeSpace.x)
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
		const {conzept} = this.state; 
	      	return (
	      		<div className="">
	      			<Navigation className="" handleDataSelect={this.handleDataSelect} updateDataRange={this.updateDataRange}/>
	      			<div className="row">
		      			<div className="col-8">
			      			<svg ref={node => this.node = node}
							    width="100%" height={1000}>
							</svg>
		      			</div>
					<div className="col-4">
						<ConzeptIFrame uri = {conzept.uri}/>
					</div>
					</div>
				</div> 
				   )
	}
}

function ConzeptIFrame(props){
	if(props.uri){
		return(
		<iframe width="100%" height="100%" id="ConzeptIFrame" src={props.uri}></iframe>
		)
	} else {
		return null; 
	}
}

export default Graph;
