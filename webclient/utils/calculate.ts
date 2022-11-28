export function getDistance(x1: number, y1: number, x2: number, y2: number) {
  const xDistance = x2 - x1;
  const yDistance = y2 - y1;
  return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

export function getAngle(x1: number, y1: number, x2: number, y2: number) {
  const xDistance = x2 - x1;
  const yDistance = y2 - y1;
  let angle = (Math.atan2(yDistance, xDistance) * 180) / Math.PI;
  if (angle < 0) {
    angle = 360 + angle;
  }
  return angle;
}
