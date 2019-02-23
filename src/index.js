import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
// import oscillator from './math/oscillator/oscillator';
// import dampenValue from './math/oscillator/dampen-value';

// const initialPosition = -5;

// const { equationOfMotion } = oscillator({
//   m: 1,
//   k: 4,
//   initialPosition,
//   initialVelocity: 50
// });

// dampenValue({
//   initialPosition,
//   onUpdate({ position, time, velocity }) {
//       console.log('Got it!', { position, time, velocity });
//   },
//   onComplete(stuff) {
//     console.log('All done!', stuff);
//   },
//   equationOfMotion
// });

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
