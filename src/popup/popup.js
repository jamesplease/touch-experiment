import React, { useRef, useState, useLayoutEffect } from 'react';
import './popup.css';
import useTouchMovement from './use-touch-movement';

export default function Popup() {
  const el = useRef();
  const [position, setPosition] = useState({});

  console.log('cooling useTouch', JSON.stringify(position));

  const coordinates = useTouchMovement({
    el,
    position,
    // position: {
    //   x: 200,
    //   y: 200,
    // },
    movement: {
      x: null,
      // y: null,
      // left: -50,
      // right: 100,
      up: null,
      // down: 50,
    },
    onTouchStart() {
      // console.log('Touch start');
    },
    onTouchEnd() {
      // console.log('Touch end');
    },
    onMovementEnd() {
      // console.log('Movement end');
    },
  });

  console.log('COORDS', JSON.stringify(coordinates));

  useLayoutEffect(() => {
    // Give the browser some time to position the popup correctly.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const bb = el.current.getBoundingClientRect();
        console.log('Updating position in popup.js', bb.left, bb.top);

        setPosition({
          x: bb.left,
          y: bb.top,
        });
      });
    });
  }, []);

  const style =
    coordinates === null
      ? {}
      : {
          top: `${coordinates.y}px`,
          // left: `${coordinates.x}px`,
        };

  console.log('RENDER style:', style);

  return (
    <div ref={el} className="popup" style={style}>
      Popup
    </div>
  );
}
