import React, { useRef } from 'react';
import './plot.css';
import { spring } from 'popmotion';

import oscillator from './math/oscillator/oscillator';

const MASS = 3;
const SPRING_FORCE = 140;

const INITIAL_POSITION = 5;
const INITIAL_VELOCITY = 0;

const TIME = 5;

// How many samples per second
const SAMPLING = 30;

export default function Plot() {
  const isDone = useRef();

  isDone.current = false;

  let newResults = [];

  spring({
    from: { x: 100, y: 0 },
    velocity: 5,
    to: { x: 0, y: 0 },
    stiffness: 240,
    mass: 1,
    damping: 100
  }).start({
    update: v => {
      newResults.push(v);
    },
    complete: () => {
      isDone.current = true;
    }
  });

  // return null;
  // const totalSamples = TIME * SAMPLING;
  // const sampleDuration = TIME / totalSamples;

  // const { equationOfMotion, bounces, extremum } = oscillator({
  //   m: MASS,
  //   k: SPRING_FORCE,
  //   initialPosition: INITIAL_POSITION,
  //   initialVelocity: INITIAL_VELOCITY
  // });

  // const results = Array.from({ length: totalSamples }).map((v, index) => {
  //   const time = sampleDuration * index;
  //   const position = equationOfMotion(time);

  //   let scaleDirection;
  //   if (bounces) {
  //     scaleDirection = time < extremum;
  //   } else {
  //     scaleDirection = true;
  //   }

  //   return {position, time, scaleDirection};
  // });

  // console.log('hello', results);
  return null;

  // return (
  //   <div className="plot">
  //     <div className="x-axis"/>
  //     <div className="y-axis"/>
  //     {newResults.map((result, index) => {
  //       console.log('should scale', result.scaleDirection);

  //       return (
  //         <div className="point" key={index} style={{
  //           left: `${result.y * 100}px`,
  //           bottom: `${result.x * 50}px` 
  //         }}/>
  //       )
  //     })}

  //   </div>
  // );
}