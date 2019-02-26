import React, { useRef, useEffect, useState } from 'react';
import './popup.css';
import useTouchMovement from '../hooks/use-touch-movement';

const MOD_TEST = 0;

export default function Popup({ onClose }) {
  const el = useRef();
  const [isIn, setIsIn] = useState(false);

  const outInfluencePoint = !isIn
    ? null
    : {
        x: 200,
        y: -70 + MOD_TEST,
      };

  const inInfluencePoint = isIn
    ? null
    : {
        x: 200,
        y: -50 + MOD_TEST,
      };

  const [coordinates, transitionTo] = useTouchMovement({
    el,
    points: [
      {
        x: 200,
        y: -150 + MOD_TEST,
        influencePoint: outInfluencePoint,
        label: 'out',
        initial: true,
      },
      {
        x: 200,
        y: 20 + MOD_TEST,
        label: 'in',
        influencePoint: inInfluencePoint,
      },
    ],
    movement: {
      x: null,
      down: 'drag',
    },
    onMovementEnd(endPosition) {
      setIsIn(endPosition.label === 'in');
      if (endPosition.label === 'out') {
        onClose();
      }
    },
  });

  useEffect(() => {
    transitionTo('in', { speed: 2000 });
  }, []);

  return (
    <div
      ref={el}
      className="popup"
      style={{
        top: `${coordinates.y}px`,
      }}>
      You are offline.
    </div>
  );
}
