import React, { Component } from 'react';
import logo from './i2m_350.png';
import './App.css';
import Graph from "./components/idea_graph";


class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to ideation session visualisation</h1>
        </header>
        <Graph/>
      </div>
    );
  }
}

export default App;
