import React, { useRef, useState } from 'react';
import './overlay.css';
import useTouchMovement from '../hooks/use-touch-movement';

export default function Overlay() {
  const el = useRef();
  const [isOpen, setIsOpen] = useState(false);

  // The points here will need to be computed based on the size of the browser window...
  const coordinates = useTouchMovement({
    el,
    active: true,
    points: [
      { x: 200, y: -400, label: 'open' },
      { x: 200, y: -55, label: 'closed', initial: true },
    ],
    movement: {
      x: null,
      up: !isOpen ? 400 - 55 : 0,
      down: isOpen ? 400 - 55 : 0,
    },
    onMovementEnd(endPosition) {
      setIsOpen(endPosition.label === 'open');
    },
  });

  return (
    <div
      ref={el}
      className="overlay"
      style={{
        top: `${coordinates.y}px`,
      }}>
      Overlay here
    </div>
  );
}
