export default function calculateDistance(one, two) {
  const oneToUse = one.influencePoint ? one.influencePoint : one;
  const twoToUse = two.influencePoint ? two.influencePoint : two;

  // For performance, we don't take the square root as we are only
  // comparing these values.
  // Additionally, we are only working in Y for the time being.
  // I need to handle situations where the user doesn't pass one
  // (or both of) the axes.
  return Math.abs(twoToUse.y - oneToUse.y);
}