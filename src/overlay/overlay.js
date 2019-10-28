import React, { useRef, useState, useEffect } from 'react';
import './overlay.css';
import useTouchMovement from '../hooks/use-touch-movement';

export default function Overlay({ onClose }) {
  const el = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const disableTouch = useRef();

  useEffect(() => {
    disableTouch.current = false;
  }, []);

  const openInfluencePoint = isOpen
    ? null
    : {
        x: 200,
        y: -255,
      };

  const closedInfluencePoint = !isOpen
    ? null
    : {
        x: 200,
        y: -220,
      };

  // The points here will need to be computed based on the size of the browser window...
  const [coordinates, transitionTo] = useTouchMovement({
    el,
    points: [
      { x: 200, y: -400, label: 'open', influencePoint: openInfluencePoint },
      {
        x: 200,
        y: -5,
        label: 'closed',
        initial: true,
        influencePoint: closedInfluencePoint,
      },
    ],
    movement: {
      x: null,
      up: !isOpen ? 400 - 5 : 'drag',
      down: isOpen ? 400 - 5 : 0,
    },
    onMovementEnd(endPosition) {
      setIsOpen(endPosition.label === 'open');
      disableTouch.current = false;

      if (endPosition.label === 'closed') {
        onClose();
      }
    },
  });

  useEffect(() => {
    transitionTo('open', { speed: 3600 });
  }, []);

  return (
    <div
      ref={el}
      className="overlay"
      onClick={e => {
        if (disableTouch.current) {
          return;
        }
        disableTouch.current = true;

        const targetPoint = isOpen ? 'closed' : 'open';
        transitionTo(targetPoint, { speed: 3200 });
      }}
      style={{
        top: `${coordinates.y}px`,
      }}>
      Overlay here
    </div>
  );
}
