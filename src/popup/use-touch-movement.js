import { useRef, useEffect, useState } from 'react';
import linearScale from '../math/linear-scale';
import springAnimation from './spring-animation';

export default function useTouchMovement({ el, maxTopMovement, position, onMovementEnd, onTouchStart, onTouchEnd }) {
  // Tip: don't use `coordinates` within this hook. Use `currentCoordinates.current`
  // instead!
  const [coordinates, updateCoordinates] = useState(position);

  // A reference to the `position` that was initially passed in.
  const initialCoordinates = useRef();

  // The initial pageX/pageY of the touch event.
  const initialTouchCoordinates = useRef();

  // The previous time, in milliseconds, of the last movement. Used
  // to calculate the velocity.
  const lastMoveTime = useRef();
  // The latest pageX/pageY from the touch event. Used to calculate
  // the velocity.
  const prevTouchCoordinates = useRef();
  // The current velocity of the swipe. Used when the touch ends
  // to apply physics to the el.
  const velocity = useRef();

  // A local reference to the coordinates
  const currentCoordinates = useRef;

  useEffect(() => {
    currentCoordinates.current = coordinates;
  }, [coordinates]);

  function onTouchStartEvent(e) {
    const touches = e.changedTouches;
    e.preventDefault();
    e.stopPropagation();

    if (touches.length !== 1) {
      return;
    } else {
      if (typeof onTouchStart === 'function') {
        onTouchStart();
      }

      const touch = touches[0];

      initialCoordinates.current = currentCoordinates.current;

      initialTouchCoordinates.current = {
        pageY: touch.pageY
      };

      prevTouchCoordinates.current = {
        pageY: touch.pageY
      };
  
      lastMoveTime.current = Date.now();
      velocity.current = {
        y: 0
      };
    }
  }

  function onTouchMoveEvent(e) {
    const touches = e.changedTouches;
    e.preventDefault();
    e.stopPropagation();

    if (touches.length !== 1) {
      return;
    } else {

      const touch = touches[0];

      const delta = touch.pageY - initialTouchCoordinates.current.pageY;

      let changeInTop;
      if (delta < 0) {
        const dampFactor = 1 - linearScale({
          domain: [0, maxTopMovement * 2],
          range: [0, 0.5],
          value: delta
        });

        let modifiedDelta = delta * dampFactor;

        if (modifiedDelta < maxTopMovement) {
          modifiedDelta = maxTopMovement;
        }
        changeInTop = modifiedDelta;
      } else {
        changeInTop = delta;
      }

      const currentTime = Date.now();

      const deltaPosition = changeInTop - prevTouchCoordinates.current.pageY;
      const deltaTime = currentTime - lastMoveTime.current;

      let newVelocity = 0;
      if (deltaTime > 0) {
        // The x1000 here is on account of the conversion between ms and seconds.
        newVelocity = deltaPosition / deltaTime * 1000;
      }

      const newTopPixels = initialCoordinates.current.y + changeInTop;

      velocity.current = {
        y: newVelocity
      };
      lastMoveTime.current = currentTime;
      prevTouchCoordinates.current = {
        pageY: changeInTop
      };

      updateCoordinates({
        y: newTopPixels
      });
    }
  }

  function onTouchEndEvent() {
    if (typeof onTouchEnd === 'function') {
      onTouchEnd();
    }

    prevTouchCoordinates.current = {
      pageY: 0
    };

    const currentTopValue = currentCoordinates.current.y;
    const initialPosition = initialCoordinates.current.y - currentTopValue;

    springAnimation({
      position: {
        y: -initialPosition
      },
      velocity: velocity.current,
      onUpdate(v) {
        const newTop = v.y + initialCoordinates.current.y;

        updateCoordinates({
          y: newTop
        });
      },
      onComplete() {
        if (typeof onMovementEnd === 'function') {
          onMovementEnd();
        }
      }
    });
  }

  useEffect(() => {
    prevTouchCoordinates.current = {
      pageY: 0
    };

    el.current.addEventListener('touchstart', onTouchStartEvent);
    el.current.addEventListener('touchmove', onTouchMoveEvent);
    el.current.addEventListener('touchcancel', onTouchEndEvent);
    el.current.addEventListener('touchend', onTouchEndEvent);

    return () => {
      el.current.remove('touchstart', onTouchStartEvent);
      el.current.remove('touchmove', onTouchMoveEvent);
      el.current.removeEventListener('touchcancel', onTouchEndEvent);
      el.current.removeEventListener('touchend', onTouchEndEvent);
    }
  }, []);

  return coordinates;
}
