import { spring } from 'popmotion';

// One day, this should be replaced with my own spring function.
// popmotion is > 13kb, which is a huge cost for just this lil spring
// computation.
export default function springAnimation({
  position,
  velocity,
  onUpdate,
  onComplete,
  stiffness = 240,
  mass = 1,
  damping = 90,
  restDelta = 10,
  restSpeed = 10
 }) {
  spring({
    from: { y: position },
    velocity: velocity,
    to: { y: 0 },
    stiffness,
    mass,
    damping,
    restDelta,
    restSpeed
  }).start({
    update: v => {
      if (typeof onUpdate === 'function') {
        onUpdate(v);
      }
    },
    complete: () => {
      if (typeof onComplete === 'function') {
        onComplete();
      }
    }
  });
}