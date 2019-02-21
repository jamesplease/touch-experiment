import { useRef, useEffect } from 'react';

export default function useDrag(el, topPixels, setTopPixels) {
  const initialTopValue = useRef();
  const lastMoveTop = useRef();
  const currentTopPixels = useRef();

  function onTouchStart(e) {
    const touches = e.changedTouches;

    if (touches.length !== 1) {
      return;
    } else {
    const touch = touches[0];
      initialTopValue.current = touch.pageY;
      lastMoveTop.current = touch.pageY;
    }
  }

  function onTouchMove(e) {
    const touches = e.changedTouches;

    if (touches.length !== 1) {
      return;
    } else {
      const touch = touches[0];

      const prevPageY = lastMoveTop.current ? lastMoveTop.current : 0;
      const delta = touch.pageY - prevPageY;
      const newTop = currentTopPixels.current + delta;
      lastMoveTop.current = touch.pageY;

      setTopPixels(newTop);
    }
  }

  function onTouchEnd() {
    lastMoveTop.current = 0;
  }

  useEffect(() => {
    currentTopPixels.current = topPixels;
  }, [topPixels]);

  // End touch hook

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
