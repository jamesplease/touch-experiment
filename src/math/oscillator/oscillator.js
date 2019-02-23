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
  const c1 = initialPosition;
  const c2 = initialVelocity + ((b * c1)/(2 * m));

  // Define the second derivative. This allows us to determine the curvature to find when the
  // function "bounces" past the equilibrium.
  function secondDerivative(t) {
    const firstFactor = b * Math.exp(-(2 * t) / (2 * m));
    const secondFactor = (c2 * (b * t - 4 * m) + b * c1);
    const denominator = 4 * Math.pow(m, 2);

    return (firstFactor * secondFactor) / denominator;
  }

  const initialCurvature = secondDerivative(0.5) > 0;
  const endCurvature = Number(secondDerivative(3).toFixed(2)) > 0;

  // This can be used to squash the equations of motion. It's ugly but ya gotta do what ya gotta do.
  const bounces = initialCurvature !== endCurvature;

  const extremum = (2 * m)/b - (c1)/(c2);

  if (bounces) {
    console.log('hello', extremum);
    // console.log('It is all over', secondDerivative(0.5), secondDerivative(1000))
  }


  return {
    bounces,
    extremum,
    equationOfMotion: function(t) {
      return Math.exp(-2 * t) * (c1 + c2 * t);
    }
  };
}