import React, { useRef, useState } from 'react';
import './popup.css';
import useDrag from './use-drag';

export default function Popup() {
  const initialTop = `200px`;

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