import React, { Component } from 'react';
import './App.css';
import Popup from './popup';
import Plot from './plot';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Plot/>
        <Popup/>
      </div>
    );
  }
}

export default App;
