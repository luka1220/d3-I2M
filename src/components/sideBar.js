import React, { Component } from 'react';
import "../css/graph.css";

export function SideBar(props){
	const { conzepts, height } = props
	var conzeptLabels = "is loading"
	if(conzepts){
		conzeptLabels = conzepts.map((conzept,i)=>{
			var label = conzept[0].split("/").pop()
			var labStyle = { backgroundColor: conzept[1].color,
							height:height}
			return (
				<div key={i} className="conzeptLabel" style={labStyle}>
					<div className="float-left">{label}</div>
					<div className="float-right">{conzept[1].frequency}</div>
				</div>
				)
		})
	}

	return ( 
		<div className="">
		<h6 id="sidebarH6" >Events: </h6>
		{conzeptLabels}
		</div>
		)
}
