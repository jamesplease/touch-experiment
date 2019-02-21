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
  // For critical damping,
  //
  // b^2 = 4mk
  // or,
  // b = 2 sqrt(mk)
  // 
  // Note that this result follows from the condition that, by definition, m,k > 0 and b >= 0
  const b = 2 * Math.sqrt(m * k);

  // We can skip calculating the roots altogether and jump straight to the solution.
  // What we can do is calculate the constants in the general solution (c1 and c2)
  const constantOne = initialPosition;
  const constantTwo = initialVelocity - ((b * constantOne) / (2 * m));

  const timeToZero = -constantOne / constantTwo;

  return {
    timeToZero,
    equationOfMotion: function(t) {
      return Math.exp(-2 * t) * (constantOne + constantTwo * t);
    }
  };
}