import React, { useRef, useState, useLayoutEffect } from 'react';
import classnames from 'classnames';
import './popup.css';
import useTouchMovement from '../hooks/use-touch-movement';

export default function Popup({ onClose }) {
  const el = useRef();
  const [isTouchActive, setIsTouchActive] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useLayoutEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setHasMounted(true);
        setTimeout(() => {
          setIsTouchActive(true);
        }, 450);
      });
    });
  }, []);

  const coordinates = useTouchMovement({
    el,
    active: isTouchActive,
    points: [
      // Offscreen
      { x: 200, y: -250, influencePoint: { x: 200, y: -70 }, label: 'out' },
      // Onscreen
      { x: 200, y: 20, initial: true },
    ],
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
    // endingVelocity: true,
    // endingVelocityScale: 12,
    onMovementEnd(endPosition) {
      if (endPosition.label === 'out') {
        onClose();
      }
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
