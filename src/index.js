import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import oscillator from './math/oscillator/oscillator';
import {getTransitionProgress, transitionNumber} from './math/transition-value';
import dampenValue from './math/oscillator/dampen-value';

window.oscillator = oscillator;
window.getTransitionProgress = getTransitionProgress;
window.transitionNumber = transitionNumber;

const { equationOfMotion } = oscillator({
  m: 5,
  k: 10,
  initialPosition: -5,
  initialVelocity: 5
});

dampenValue({
  onUpdate(x) {
    console.log('Got it!', x);
  },
  equationOfMotion
});

// console.log('ow much time', timeToZero * 1000);

// let logged = false;

// getTransitionProgress({
//   durationMs: 10000000,
//   easingFunction: 'linear',
//   onUpdate(val, elapsedTime) {
//     const x = equationOfMotion(elapsedTime / 100);

//     const position = Number(x.toFixed(2));

//     if (position === 0 && !logged) {
//       logged = true;
//       console.log('Made it', elapsedTime);
//     }
//   }
// })





ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
