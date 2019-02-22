//
// These functions can be used to animate numbers in JavaScript. This can allow you to smoothly
// transition, say, some component state between two values to perform an animation.
//

const maxCount = 5000;

// This function maps [0, 1] to [0, 1] according to the easing that you specify.
export default function dampenValue({
  initialPosition,
  onUpdate,
  equationOfMotion,
  onComplete
}) {
  let totalTime = 0;
  let lastTime = Date.now();
  let count = 0;
  let lastPosition = initialPosition;

  function moveNext() {
    // The current progress is how much time has passed divided by the duration, which is the
    // total time. This should always be between 0 and 1.
    // We use our easing function to find the current position

    const time = totalTime / 1000;

    const rawPosition = equationOfMotion(time);
    // Round our position so that it eventually reaches 0.
    // Because of how smooth the curve is at the end, the values will hang around at,
    // say, 0.01 for quite some time. For initial velocities of zero, it'll never even
    // reach 0 (at least, mathematically. JavaScript will round it to 0 eventually).
    // This resolution should be sufficient for rendering.
    const position = Number(rawPosition.toFixed(1));
    const currentTime = Date.now();

    const velocity = (rawPosition - lastPosition)/(currentTime - lastTime);

    onUpdate({ position, time, velocity });

    // The velocity check here guards against situations where the we are zooming
    // past equilibrium due to a high initial velocity toward it.
    const mayBeNearingEnd = position === 0 && Math.abs(velocity) < 0.0001;

    // If we're not nearing the end, then we keep going. We also add a check against infinite loops, just
    // to be safe.
    if (!mayBeNearingEnd && count < maxCount) {
      // Update the total time with however much time has passed since our lastTime.
      totalTime += currentTime - lastTime;

      lastTime = currentTime;
      count = count + 1;
      lastPosition = rawPosition;

      requestAnimationFrame(moveNext);
    } else {
      if (typeof onComplete === 'function') {
        onComplete({ position, time, velocity });
      }
    }
  }

  requestAnimationFrame(moveNext);
}