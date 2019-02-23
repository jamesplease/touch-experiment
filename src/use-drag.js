import { useRef, useEffect } from 'react';
import linearScale from './math/linear-scale';
import { spring } from 'popmotion';

// const TRANSITION_TIME = 200;

function getNumberFromPixel(pixelValue) {
  return Number(pixelValue.split('px')[0]);
}

// function transition(styles, setStyles, initialTop, moveDistance) {
//   setStyles({
//     pointerEvents: 'none',
//     transition: 'none',
//     top: initialTop,
//     transform: `translateY(${moveDistance}px)`
//   });

//   requestAnimationFrame(() => {
//     requestAnimationFrame(() => {
//       setStyles({
//         top: initialTop,
//         pointerEvents: 'none',
//         transition: `transform ${TRANSITION_TIME}ms ease-in-out`,
//         transform: 'none'
//       });

//       setTimeout(() => {
//         setStyles({
//           top: initialTop
//         });
//       }, TRANSITION_TIME);
//     });
//   });
// }

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

  function freefall(initialPosition, velocity) {
    spring({
      from: { y: initialPosition },
      velocity,
      to: { y: 0 },
      stiffness: 240,
      mass: 1,
      damping: 90,
      restDelta: 10,
      restSpeed: 10
    }).start({
      update: v => {
        // console.log('hello', v);

        setStyles({
          top: `${v.y + Number(initialTopPixels.current)}px`
        });
      },
      complete: () => {
        console.log('done');
      }
    });

    // const { equationOfMotion } = oscillator({
    //   m: 1,
    //   k: 4,
    //   initialPosition,
    //   initialVelocity
    // });

    // dampenValue({
    //   initialPosition,
    //   onUpdate({ position, time, velocity }) {

    //     setStyles({
    //       top: `${position + Number(initialTopPixels.current)}px`
    //     });
    //   },
    //   onComplete(stuff) {
    //     console.log('All done!', stuff);
    //   },
    //   equationOfMotion
    // });
  }

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

    // Maybe also calculate the velocity here?
    // console.log('what is velocity', velocity.current);

    const currentTopValue = getNumberFromPixel(currentStyles.current.top);
    // const moveDistance = currentTopValue - initialTopPixels.current;

    const initialPosition = Number(initialTopPixels.current) - currentTopValue;

    // if (moveDistance !== 0 && velocity.current < 0.3) {
    //   transition(currentStyles.current, setStyles, initialTop, moveDistance);
    // } else {
      console.log('freefall!', velocity.current);
      freefall(-initialPosition, velocity.current * 1000);
    // }
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
