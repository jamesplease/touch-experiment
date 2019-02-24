import React, { useRef, useState, useLayoutEffect } from 'react';
import classnames from 'classnames';
import './popup.css';
import useTouchMovement from './use-touch-movement';

export default function Popup() {
  const el = useRef();
  const [isTouchActive, setIsTouchActive] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useLayoutEffect(() => {
    setTimeout(() => {
      setHasMounted(true);
      setTimeout(() => {
        setIsTouchActive(true);
      }, 450);
    }, 1000);
  }, []);

  const coordinates = useTouchMovement({
    el,
    active: isTouchActive,
    position: {
      x: 200,
      y: 20,
    },
    movement: {
      x: null,
      // y: null,
      // left: -50,
      // left: 50,
      // right: 25,
      // right: 100,
      // up: 'drag',
      down: 'drag',
    },
    endingVelocity: true,
    endingVelocityScale: 12,
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

  let coordsToUse;
  if (!isTouchActive) {
    coordsToUse = {
      y: 20,
    };
  } else {
    coordsToUse = coordinates;
  }

  return (
    <div
      ref={el}
      className={classnames('popup', {
        'popup-entered': hasMounted,
      })}
      style={{
        top: `${coordsToUse.y}px`,
        // left: `${coordinates.x}px`,
      }}>
      You are offline.
    </div>
  );
}
