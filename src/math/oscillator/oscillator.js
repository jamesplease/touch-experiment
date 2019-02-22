// This is a function to assist with solving the equations of motion for an
// arbitrary critically damped harmonic oscillator.
//
// These equations are motion are especially valuable in any kind of motion
// design.
//
// General damped harmonic oscillator equation:
// 
// mx″+bx′+kx = 0
//
// where m,k > 0 and b >= 0
//
// Accordingly, the user only needs to input m and k to uniquely define a
// critically damped harmonic oscillator.
//
// TODO: split this up into two functions. One that doesn't rely on initial positions,
// and another that does.
//
export default function oscillatorEquationsOfMotion({ m, k, initialPosition, initialVelocity }) {
  // We can skip calculating the roots altogether and jump straight to the solution.
  // What we can do is calculate the constants in the general solution (c1 and c2)
  const constantOne = initialPosition;
  const constantTwo = initialVelocity + 2 * constantOne;

  console.log('gu', constantOne, constantTwo);

  const timeToZero = -constantOne / constantTwo;

  return {
    timeToZero,
    equationOfMotion: function(t) {
      return Math.exp(-2 * t) * (constantOne + constantTwo * t);
    }
  };
}