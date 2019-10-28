import { useRef, useEffect, useState } from 'react';
import springTo from './spring-to';
import calculateDistance from './calculate-distance';

// If the touch end event occurs after this amount of time,
// then we will use a velocity of 0.
const VELOCITY_CHECK_FREQUENCY = 100;

export default function useTouchMovement({
  el,
  active = true,
  points = [],
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

  const restraints = useRef();

  restraints.current = {
    left: typeof left !== 'undefined' ? left : null,
    right: typeof right !== 'undefined' ? right : null,
    up: typeof up !== 'undefined' ? up : null,
    down: typeof down !== 'undefined' ? down : null,
  };

  const initialPosition = points.filter(v => v.initial)[0];
  // Tip: don't use `coordinates` within this hook. Use `currentCoordinates.current`
  // instead!
  const [coordinates, updateCoordinates] = useState({
    x: initialPosition.x,
    y: initialPosition.y,
  });

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

  const pointsRef = useRef();

  useEffect(() => {
    pointsRef.current = points;
  }, [points]);

  // This is to handle an edge case. If you drag an item, let go,
  // and during its transition you try to touch it again, we set
  // it as _ignoring_ the touch.
  // isIgnoringTouch.current = false;

  useEffect(() => {
    currentCoordinates.current = coordinates;
  }, [coordinates]);

  function onTouchStartEvent(e) {
    const touches = e.changedTouches;
    // e.preventDefault();
    // e.stopPropagation();

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

      const pageXDelta = initialTouchCoordinates.current
        ? touch.pageX - initialTouchCoordinates.current.pageX
        : 0;
      const pageYDelta = initialTouchCoordinates.current
        ? touch.pageY - initialTouchCoordinates.current.pageY
        : 0;

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
      const yRestraint = restraints.current[yDirection];
      const absChangeInY = Math.abs(changeInY);
      const yDirectionModifier = yDirection === 'up' ? -1 : 1;

      if (typeof yRestraint === 'number') {
        if (absChangeInY > yRestraint) {
          changeInY = yDirectionModifier * yRestraint;
        }
      } else if (yRestraint === 'drag') {
        // TODO: set the drag factor as a config option
        changeInY = yDirectionModifier * Math.pow(absChangeInY, 0.75);
      }

      const hasChangedX = changeInX !== 0;
      const xDirection = hasChangedX && changeInX > 0 ? 'right' : 'left';
      const xRestraint = restraints.current[xDirection];
      const absChangeInX = Math.abs(changeInX);
      const xDirectionModifier = xDirection === 'left' ? -1 : 1;

      if (typeof xRestraint === 'number') {
        if (absChangeInX > xRestraint) {
          changeInX = xDirectionModifier * xRestraint;
        }
      } else if (xRestraint === 'drag') {
        // TODO: set the drag factor as a config option
        changeInX = xDirectionModifier * Math.pow(absChangeInX, 0.75);
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

    prevTouchCoordinates.current = {
      pageX: 0,
      pageY: 0,
    };

    // This is how far we have moved.

    const pointsWithDistance = pointsRef.current.map(p => {
      return {
        ...p,
        distance: calculateDistance(p, currentCoordinates.current),
      };
    });

    pointsWithDistance.sort((a, b) => {
      return a.distance - b.distance;
    });

    const destinationPoint = pointsWithDistance[0];

    const initialX = currentCoordinates.current.x - destinationPoint.x;
    const initialY = currentCoordinates.current.y - destinationPoint.y;

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
      restSpeed = 15;
      restDelta = 15;
    } else {
      velocityToUse = velocity.current;
      stiffness = 240;
      restSpeed = 10;
      restDelta = 10;
    }

    // Only spring if there is somewhere to go
    // This breaks the fuckin shit. HOW
    if (initialY !== 0 || initialX !== 0) {
      isSpringingBack.current = true;

      springTo({
        initialX,
        initialY,
        stiffness,
        velocity: velocityToUse,
        restSpeed,
        restDelta,
        destinationPoint,
        updateCoordinates,
        isSpringingBack,
        onMovementEnd,
        points: pointsRef.current,
      });
    }
  }

  useEffect(() => {
    if (active) {
      prevTouchCoordinates.current = {
        pageX: 0,
        pageY: 0,
      };

      el.current.addEventListener('touchstart', onTouchStartEvent);
      el.current.addEventListener('touchmove', onTouchMoveEvent);
      el.current.addEventListener('touchcancel', onTouchEndEvent);
      el.current.addEventListener('touchend', onTouchEndEvent);
    } else {
      el.current.removeEventListener('touchstart', onTouchStartEvent);
      el.current.removeEventListener('touchmove', onTouchMoveEvent);
      el.current.removeEventListener('touchcancel', onTouchEndEvent);
      el.current.removeEventListener('touchend', onTouchEndEvent);
    }
  }, [active]);

  // TODO; useMemo this
  function transitionTo(point, { speed = 3000 } = {}) {
    const destinationPoint = pointsRef.current.filter(
      v => v.label === point
    )[0];
    const initialX = currentCoordinates.current.x - destinationPoint.x;
    const initialY = currentCoordinates.current.y - destinationPoint.y;

    const velocityDirection = initialY > 0 ? -1 : 1;

    springTo({
      initialX,
      initialY,
      stiffness: 240,
      restSpeed: 10,
      restDelta: 10,
      velocity: {
        x: 0,
        y: velocityDirection * speed,
      },
      destinationPoint,
      updateCoordinates,
      isSpringingBack,
      onMovementEnd,
      points: pointsRef.current,
    });
  }

  return [coordinates, transitionTo];
}
