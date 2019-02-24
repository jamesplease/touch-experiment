import { useRef, useEffect, useState } from 'react';
import linearScale from '../math/linear-scale';
import springAnimation from './spring-animation';

// If the touch end event occurs after this amount of time,
// then we will use a velocity of 0.
const VELOCITY_CHECK_FREQUENCY = 100;

export default function useTouchMovement({
  el,
  maxTopMovement,
  position,
  movement = {},
  onMovementEnd,
  onTouchStart,
  onTouchEnd,
  endingVelocity,
  endingVelocityScale = 12,
}) {
  const { x, y, left, right, up, down } = movement;

  const rightIsDisabled = right === null;
  const leftIsDisabled = left === null;
  const upIsDisabled = up === null;
  const downIsDisabled = down === null;

  const disableXMovement = (rightIsDisabled && leftIsDisabled) || x === null;
  const disableYMovement = (downIsDisabled && upIsDisabled) || y === null;

  const restraints = {
    left: typeof left !== 'undefined' ? left : null,
    right: typeof right !== 'undefined' ? right : null,
    up: typeof up !== 'undefined' ? up : null,
    down: typeof down !== 'undefined' ? down : null,
  };

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
  const currentCoordinates = useRef();

  const isSpringingBack = useRef();
  const isIgnoringTouch = useRef();

  // This is to handle an edge case. If you drag an item, let go,
  // and during its transition you try to touch it again, we set
  // it as _ignoring_ the touch.
  // isIgnoringTouch.current = false;

  useEffect(() => {
    currentCoordinates.current = coordinates;
  }, [coordinates]);

  function onTouchStartEvent(e) {
    const touches = e.changedTouches;
    e.preventDefault();
    e.stopPropagation();

    if (isSpringingBack.current) {
      isIgnoringTouch.current = true;
    }

    if (isSpringingBack.current) {
      return;
    } else {
      if (typeof onTouchStart === 'function') {
        onTouchStart();
      }

      const touch = touches[0];

      initialCoordinates.current = currentCoordinates.current;

      initialTouchCoordinates.current = {
        pageX: touch.pageX,
        pageY: touch.pageY,
      };

      prevTouchCoordinates.current = {
        pageX: touch.pageX,
        pageY: touch.pageY,
      };

      lastMoveTime.current = Date.now();
      velocity.current = {
        x: 0,
        y: 0,
      };
    }
  }

  function onTouchMoveEvent(e) {
    const touches = e.changedTouches;
    e.preventDefault();
    e.stopPropagation();

    if (isIgnoringTouch.current) {
      return;
    } else {
      const touch = touches[0];

      const pageXDelta = touch.pageX - initialTouchCoordinates.current.pageX;
      const pageYDelta = touch.pageY - initialTouchCoordinates.current.pageY;

      let changeInX;
      let changeInY;

      if (disableXMovement) {
        changeInX = 0;
      } else {
        changeInX = pageXDelta;
      }

      if (disableYMovement) {
        changeInY = 0;
      } else if (upIsDisabled) {
        changeInY = pageYDelta > 0 ? pageYDelta : 0;
      } else if (downIsDisabled) {
        changeInY = pageYDelta < 0 ? pageYDelta : 0;
      } else {
        changeInY = pageYDelta;
      }

      const hasChangedY = changeInY !== 0;
      const yDirection = hasChangedY && changeInY > 0 ? 'down' : 'up';
      const yRestraint = restraints[yDirection];
      const absChangeInY = Math.abs(changeInY);
      const yDirectionModifier = yDirection === 'up' ? -1 : 1;

      if (typeof yRestraint === 'number') {
        if (absChangeInY > yRestraint) {
          changeInY = yDirectionModifier * yRestraint;
        }
      } else if (yRestraint === 'drag') {
        // TODO: set the drag factor as a config option
        changeInY = yDirectionModifier * Math.pow(absChangeInY, 0.7);
      }

      const hasChangedX = changeInX !== 0;
      const xDirection = hasChangedX && changeInX > 0 ? 'right' : 'left';
      const xRestraint = restraints[xDirection];
      const absChangeInX = Math.abs(changeInX);
      const xDirectionModifier = xDirection === 'left' ? -1 : 1;

      if (typeof xRestraint === 'number') {
        if (absChangeInX > xRestraint) {
          changeInX = xDirectionModifier * xRestraint;
        }
      } else if (xRestraint === 'drag') {
        // TODO: set the drag factor as a config option
        changeInX = xDirectionModifier * Math.pow(absChangeInX, 0.7);
      }

      const currentTime = Date.now();

      const deltaX = changeInX - prevTouchCoordinates.current.pageX;
      const deltaY = changeInY - prevTouchCoordinates.current.pageY;
      const deltaTime = currentTime - lastMoveTime.current;

      let newVelocityY = 0;
      let newVelocityX = 0;
      if (deltaTime > 0) {
        // The x1000 here is on account of the conversion between ms and seconds.
        newVelocityX = (deltaX / deltaTime) * 1000;
        newVelocityY = (deltaY / deltaTime) * 1000;
      }

      const newX = initialCoordinates.current.x + changeInX;
      const newY = initialCoordinates.current.y + changeInY;

      velocity.current = {
        x: newVelocityX,
        y: newVelocityY,
      };
      lastMoveTime.current = currentTime;
      prevTouchCoordinates.current = {
        pageX: changeInX,
        pageY: changeInY,
      };

      updateCoordinates({
        x: newX,
        y: newY,
      });
    }
  }

  function onTouchEndEvent(e) {
    if (isIgnoringTouch.current) {
      isIgnoringTouch.current = false;
      return;
    }

    if (typeof onTouchEnd === 'function') {
      onTouchEnd();
    }

    isSpringingBack.current = true;

    prevTouchCoordinates.current = {
      pageX: 0,
      pageY: 0,
    };

    const initialX =
      initialCoordinates.current.x - currentCoordinates.current.x;
    const initialY =
      initialCoordinates.current.y - currentCoordinates.current.y;

    const currentTime = Date.now();
    const deltaTime = currentTime - lastMoveTime.current;

    let velocityToUse;
    let stiffness;
    let restSpeed;
    let restDelta;
    if (deltaTime > VELOCITY_CHECK_FREQUENCY) {
      const size = Math.abs(initialY);
      const direction = initialY > 0 ? 1 : -1;

      velocityToUse = endingVelocity
        ? direction * Math.pow(size, 1.085) * endingVelocityScale
        : 0;

      velocityToUse = {
        x: 0,
        y: velocityToUse,
      };
      stiffness = 200;
      restSpeed = 0.1;
      restDelta = 0.1;
    } else {
      velocityToUse = velocity.current;
      stiffness = 240;
      restSpeed = 10;
      restDelta = 10;
    }

    springAnimation({
      position: {
        x: -initialX,
        y: -initialY,
      },
      stiffness,
      velocity: velocityToUse,
      restSpeed,
      restDelta,
      onUpdate(update) {
        const newX = update.x + initialCoordinates.current.x;
        const newY = update.y + initialCoordinates.current.y;

        updateCoordinates({
          x: newX,
          y: newY,
        });
      },
      onComplete() {
        isSpringingBack.current = false;

        if (typeof onMovementEnd === 'function') {
          onMovementEnd();
        }
      },
    });
  }

  useEffect(() => {
    prevTouchCoordinates.current = {
      pageX: 0,
      pageY: 0,
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
    };
  }, []);

  return coordinates;
}
