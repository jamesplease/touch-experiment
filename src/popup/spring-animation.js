import { spring } from 'popmotion';

// One day, this should be replaced with my own spring function.
// popmotion is > 13kb, which is a huge cost for just this lil spring
// computation.
export default function springAnimation({
  position,
  velocity,
  onUpdate,
  onComplete
 }) {
  spring({
    from: { y: position },
    velocity: velocity,
    to: { y: 0 },
    stiffness: 240,
    mass: 1,
    damping: 90,
    restDelta: 10,
    restSpeed: 10
  }).start({
    update: v => {
      onUpdate(v);
    },
    complete: () => {
      if (typeof onComplete === 'function') {
        onComplete();
      }
    }
  });
}