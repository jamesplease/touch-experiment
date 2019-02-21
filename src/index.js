import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import oscillator from './math/oscillator/oscillator';
import {getTransitionProgress, transitionNumber} from './math/transition-value';

window.oscillator = oscillator;
window.getTransitionProgress = getTransitionProgress;
window.transitionNumber = transitionNumber;


const { timeToZero, equationOfMotion } = oscillator({
  m: 4,
  k: 4,
  initialPosition: -5,
  initialVelocity: 0
});

console.log('ow much time', timeToZero);

getTransitionProgress({
  durationMs: 414,
  easingFunction: 'linear',
  onUpdate(val, elapsedTime) {
    const x = equationOfMotion(elapsedTime / 100);

    const position = Number(x.toFixed(2));

    console.log('The position is...', elapsedTime, position);
  }
})





ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
