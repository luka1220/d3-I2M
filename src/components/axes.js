import React, { Component } from 'react';
import "../css/graph.css";


export function Axes(props){

	const { startPoint, timerEndPoint, interval} = props
	var limit = (timerEndPoint/3)/interval
	var arrTime = new Array()
	for(var i = 0; i < limit; i++){arrTime.push(i*interval)}
	const timeIndex = arrTime.map(nr=>{
		return <text dx={startPoint.x + timerEndPoint - (nr*3)} dy={startPoint.y-40} >{nr}</text>
	})
	return (
		<g id="axeX">
		{timeIndex}
		<line x1={startPoint.x} y1={startPoint.y} 
			x2={timerEndPoint+startPoint.x} y2={startPoint.y}
			stroke="black" strokeWidth={5} />
		</g>
		)
		
}

