import { useRef, useEffect } from 'react';
import linearScale from '../math/linear-scale';
import springAnimation from './spring-animation';

function getNumberFromPixel(pixelValue) {
  return Number(pixelValue.split('px')[0]);
}

export default function useDrag({ el, maxTopMovement, styles, setStyles, initialTop }) {
  const initialTopPixels = useRef();
  const initialPageY = useRef();
  const lastMoveTop = useRef();
  const currentStyles = useRef();

  const lastMoveTime = useRef();
  const velocity = useRef();

  useEffect(() => {
    currentStyles.current = styles;
  }, [styles]);

  function onTouchStart(e) {
    const touches = e.changedTouches;
    e.preventDefault();
    e.stopPropagation();

    if (touches.length !== 1) {
      return;
    } else {
      const touch = touches[0];

      const initialTopValue = getNumberFromPixel(currentStyles.current.top);
      initialTopPixels.current = initialTopValue;
      initialPageY.current = touch.pageY;
      lastMoveTop.current = touch.pageY;
      lastMoveTime.current = Date.now();
      velocity.current = 0;
    }
  }

  function onTouchMove(e) {
    const touches = e.changedTouches;
    e.preventDefault();
    e.stopPropagation();

    if (touches.length !== 1) {
      return;
    } else {

      const touch = touches[0];

      const delta = touch.pageY - initialPageY.current;

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

      const deltaPosition = changeInTop - lastMoveTop.current;
      const deltaTime = currentTime - lastMoveTime.current;

      let newVelocity = 0;
      if (deltaTime > 0) {
        newVelocity = deltaPosition / deltaTime;
      }

      const newTopPixels = initialTopPixels.current + changeInTop;

      velocity.current = newVelocity;
      lastMoveTime.current = currentTime;
      lastMoveTop.current = changeInTop;

      setStyles({
        ...currentStyles.current,
        top: `${newTopPixels}px`
      });
    }
  }

  function onTouchEnd() {
    lastMoveTop.current = 0;

    const currentTopValue = getNumberFromPixel(currentStyles.current.top);
    const initialPosition = Number(initialTopPixels.current) - currentTopValue;

    springAnimation({
      position: -initialPosition,
      velocity: velocity.current * 1000,
      onUpdate(v) {
        setStyles({
          top: `${v.y + Number(initialTopPixels.current)}px`
        });
      },
      onComplete() {
        console.log('aruuugula');
      }
    });
  }

  useEffect(() => {
    lastMoveTop.current = 0;

    el.current.addEventListener('touchstart', onTouchStart);
    el.current.addEventListener('touchmove', onTouchMove);
    el.current.addEventListener('touchcancel', onTouchEnd);
    el.current.addEventListener('touchend', onTouchEnd);

    return () => {
      el.current.remove('touchstart', onTouchStart);
      el.current.remove('touchmove', onTouchMove);
      el.current.removeEventListener('touchcancel', onTouchEnd);
      el.current.removeEventListener('touchend', onTouchEnd);
    }
  }, []);
}
