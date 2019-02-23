import React, { useRef } from 'react';
import './popup.css';
import useTouchMovement from './use-touch-movement';

export default function Popup() {
  const el = useRef();

  const coordinates = useTouchMovement({
    el,
    position: {
      x: 200,
      y: 200,
    },
    maxTopMovement: -150,
    movement: {
      // x: null,
      // y: null,
      // up: null,
      // down: -150,
    },
    topDrag: null,
    onTouchStart() {
      console.log('Touch start');
    },
    onTouchEnd() {
      console.log('Touch end');
    },
    onMovementEnd() {
      console.log('Movement end');
    },
  });

  return (
    <div
      ref={el}
      className="popup"
      style={{
        top: `${coordinates.y}px`,
        left: `${coordinates.x}px`,
      }}>
      Popup
    </div>
  );
}
