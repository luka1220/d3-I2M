

import JSON_DATA from '../CHI19S1-ideas.json';
import "./graph.css";
const React = require('react');
var d3 = require("d3");


class Graph extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			startPoint: {x:30, y:30}
		}
		this.setgraph = this.setgraph.bind(this)
	}

	componentDidMount() {
		
		var data = this.dataHandler(10)
		
		this.setgraph(data.nodes, data.links)
		this.setgraph(data.conzeptNodes, [])
	}

	dataHandler = (amount) => {
		const data = JSON_DATA.slice(0,amount); 
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
	setNodes(nodes, place){
		var elem = d3.select(place)
	    	.selectAll('rect')
		   .data(nodes)
		   
		var elemEnter = elem.enter()
			.append("g")
        	//.attr("transform", function(d){return "translate("+d.x+",80)"})

		var circle = elemEnter.append("svg:circle")
		   .attr("cx", function(d) { return d.x; })
		   .attr("cy", function(d) { return d.y; })
		   .attr("r", "20px")
		   .attr("fill", function(d) { return d.color; })

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

	render(){
	      	return <svg ref={node => this.node = node}
				    width={1000} height={500}>
				   </svg>
	}
}

export default Graph;
