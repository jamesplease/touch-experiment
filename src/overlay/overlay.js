import React, { useRef, useState } from 'react';
import './overlay.css';
import useTouchMovement from '../hooks/use-touch-movement';

export default function Overlay() {
  const el = useRef();
  const [isOpen, setIsOpen] = useState(false);

  const openInfluencePoint = isOpen
    ? null
    : {
        x: 200,
        y: -200,
      };

  const closedInfluencePoint = !isOpen
    ? null
    : {
        x: 200,
        y: -200,
      };

  // The points here will need to be computed based on the size of the browser window...
  const coordinates = useTouchMovement({
    el,
    active: true,
    points: [
      { x: 200, y: -400, label: 'open', influencePoint: openInfluencePoint },
      {
        x: 200,
        y: -55,
        label: 'closed',
        initial: true,
        influencePoint: closedInfluencePoint,
      },
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
      onClick={e => {
        console.log('Clicked!');
      }}
      style={{
        top: `${coordinates.y}px`,
      }}>
      Overlay here
    </div>
  );
}
