import React, { useRef, useState } from 'react';
import './popup.css';
import useDrag from './use-drag';
// import oscillator from './math/oscillator/oscillator';
// import dampenValue from './math/oscillator/dampen-value';

// const X_SCALE_FACTOR = 1;
// const INITIAL_POSITION = -50;
// const INITIAL_VELOCITY = 500;
// const EQUILIBRIUM = 300;

export default function Popup() {
  // return null;
  const initialTop = `220px`;

  const [styles, setStyles] = useState({
    top: initialTop
  });

  const el = useRef();

  useDrag({
    initialTop,
    el,
    maxTopMovement: -150,
    styles,
    setStyles
  });

  return (
    <div ref={el} className="popup" style={styles}>
      Popup
    </div>
  )
}