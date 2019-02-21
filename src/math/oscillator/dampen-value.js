//
// These functions can be used to animate numbers in JavaScript. This can allow you to smoothly
// transition, say, some component state between two values to perform an animation.
//

const maxCount = 5000;

// This function maps [0, 1] to [0, 1] according to the easing that you specify.
export default function dampenValue({
  onUpdate,
  equationOfMotion,
}) {
  let totalTime = 0;
  let lastTime = Date.now();
  let count = 0;

  function moveNext() {
    // The current progress is how much time has passed divided by the duration, which is the
    // total time. This should always be between 0 and 1.
    // We use our easing function to find the current position
    onUpdate(totalTime);

    console.log('The total time is...', totalTime);

    const rawPosition = equationOfMotion(totalTime / 100);
    // Round our position so that it eventually reaches 0
    const position = Number(rawPosition.toFixed(2));

    onUpdate(position);

    // Update the total time with however much time has passed since our lastTime.
    totalTime += Date.now() - lastTime;

    lastTime = Date.now();
    count = count + 1;

    if (position !== 0 && count < maxCount) {
      requestAnimationFrame(moveNext);
    }
  }

  requestAnimationFrame(moveNext);
}