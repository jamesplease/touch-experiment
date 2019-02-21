import easingFunctions from './easing-functions';
import clamp from './clamp';

//
// These functions can be used to animate numbers in JavaScript. This can allow you to smoothly
// transition, say, some component state between two values to perform an animation.
//

// This function maps [0, 1] to [0, 1] according to the easing that you specify.
export function getTransitionProgress({
  durationMs,
  easingFunction,
  onUpdate,
}) {
  let totalTime = 0;
  let progress = 0;
  let lastTime = Date.now();
  const easing = easingFunctions[easingFunction];

  function moveNext() {
    // The current progress is how much time has passed divided by the duration, which is the
    // total time. This should always be between 0 and 1.
    progress = clamp(0, totalTime / durationMs, 1);
    const result = clamp(0, easing(progress), 1);

    // We use our easing function to find the current position
    onUpdate(result, clamp(0, totalTime, durationMs));

    // Update the total time with however much time has passed since our lastTime.
    totalTime += Date.now() - lastTime;

    lastTime = Date.now();

    if (progress < 1) {
      requestAnimationFrame(moveNext);
    }
  }

  requestAnimationFrame(moveNext);
}

// Given a `progress` (a number in [0, 1]), returns you the transitioned value between
// initialNumber and finalNumber.
export function transitionNumber({ initialNumber, finalNumber, progress }) {
  const clampedProgress = clamp(0, progress, 1);
  return initialNumber + (finalNumber - initialNumber) * clampedProgress;
}
