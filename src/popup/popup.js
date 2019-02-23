import React, { useRef } from 'react';
import './popup.css';
import useDrag from './use-drag';

export default function Popup() {
  const el = useRef();

  const coordinates = useDrag({
    el,
    position: {
      y: 200
    },
    maxTopMovement: -150,
    topDrag: null,
  });

  return (
    <div ref={el} className="popup" style={{
      top: `${coordinates.y}px`
    }}>
      Popup
    </div>
  )
}