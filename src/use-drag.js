import { useRef, useEffect } from 'react';
import linearScale from './linear-scale';

const TRANSITION_TIME = 200;

function getNumberFromPixel(pixelValue) {
  return Number(pixelValue.split('px')[0]);
}

function transition(overEl, styles, setStyles, initialTop) {
  setStyles({
    pointerEvents: 'none',
    transition: 'none',
    top: initialTop,
    transform: 'translateY(-100px)'
  });

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      setStyles({
        top: initialTop,
        pointerEvents: 'none',
        transition: `transform ${TRANSITION_TIME}ms ease-in-out`,
        transform: 'none'
      });

      setTimeout(() => {
        setStyles({
          top: initialTop
        });
      }, TRANSITION_TIME);
    });
  });
}


export default function useDrag({ el, maxTopMovement, styles, setStyles, initialTop }) {
  const initialTopPixels = useRef();
  const initialPageY = useRef();
  const lastMoveTop = useRef();
  const currentStyles = useRef();

  useEffect(() => {
    currentStyles.current = styles;
  }, [styles]);

  function onTouchStart(e) {
    const touches = e.changedTouches;

    if (touches.length !== 1) {
      return;
    } else {
      const touch = touches[0];

      const initialTopValue = getNumberFromPixel(currentStyles.current.top);
      initialTopPixels.current = initialTopValue;
      initialPageY.current = touch.pageY;
      lastMoveTop.current = touch.pageY;
    }
  }

  function onTouchMove(e) {
    const touches = e.changedTouches;

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

      const newTopPixels = initialTopPixels.current + changeInTop;
      setStyles({
        ...currentStyles.current,
        top: `${newTopPixels}px`
      });
    }
  }

  function onTouchEnd() {
    lastMoveTop.current = 0;

    const currentTopValue = getNumberFromPixel(currentStyles.current.top);
    const moveDistance = currentTopValue - initialTopPixels.current;
    if (moveDistance !== 0) {
      transition(el.current, currentStyles.current, setStyles, initialTop);
    }
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
