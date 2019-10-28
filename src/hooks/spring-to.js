import springAnimation from './spring-animation';
import calculateDistance from './calculate-distance';

export default function springTo({
  initialX,
  initialY,
  destinationPoint,
  stiffness,
  velocity,
  restSpeed,
  restDelta,
  updateCoordinates,
  isSpringingBack,
  onMovementEnd,
  points,
}) {
  const stop = springAnimation({
    position: {
      x: initialX,
      y: initialY,
    },
    stiffness,
    velocity,
    restSpeed,
    restDelta,
    onUpdate(update) {
      const newX = update.x + destinationPoint.x;
      const newY = update.y + destinationPoint.y;

      const currentPosition = {
        x: newX,
        y: newY,
      };

      const pointsWithDistance = points.map(p => {
        return {
          ...p,
          distance: calculateDistance(p, currentPosition),
        };
      });

      pointsWithDistance.sort((a, b) => {
        return a.distance - b.distance;
      });

      const newDestinationPoint = pointsWithDistance[0];

      // If our destination point within this update isn't the same one
      // that we are springing to, then we switch. This allows you to "flick"
      // an item over a threshold, rather than dragging it.
      if (
        newDestinationPoint.x !== destinationPoint.x ||
        newDestinationPoint.y !== destinationPoint.y
      ) {
        stop();
        springTo({
          initialX: newX - newDestinationPoint.x,
          initialY: newY - newDestinationPoint.y,
          destinationPoint: newDestinationPoint,
          stiffness,
          velocity,
          restSpeed,
          restDelta,
          updateCoordinates,
          isSpringingBack,
          onMovementEnd,
          points,
        });

        return;
        // springTo(destinationPoint)
      }

      // TODO: check if I am now closer to another point.
      // If so, cancel this spring and start a new one.
      // I'll need to track the velocity to ensure a smooth transition.

      updateCoordinates({
        x: newX,
        y: newY,
      });
    },
    onComplete() {
      isSpringingBack.current = false;

      if (typeof onMovementEnd === 'function') {
        onMovementEnd(destinationPoint);
      }
    },
  });
}