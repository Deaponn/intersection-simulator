import type { CarRenderState } from "./snapshotMapper";

export const lerp = (start: number, end: number, t: number) => {
  return start + (end - start) * t;
};

export const bezier = (
  start: number,
  control: number,
  end: number,
  t: number,
) => {
  const inv = 1 - t;
  return inv * inv * start + 2 * inv * t * control + t * t * end;
};

export const lerpAngle = (start: number, end: number, t: number) => {
  let diff = end - start;
  while (diff < -180) diff += 360;
  while (diff > 180) diff -= 360;
  return start + diff * t;
};

export const getCarFrame = (
  start: CarRenderState,
  end: CarRenderState,
  t: number,
) => {
  const isTurn = Math.abs(start.rotation - end.rotation) > 1;

  let x, y;
  if (isTurn) {
    const controlX = start.rotation % 180 === 0 ? start.x : end.x;
    const controlY = start.rotation % 180 === 0 ? end.y : start.y;

    x = bezier(start.x, controlX, end.x, t);
    y = bezier(start.y, controlY, end.y, t);
  } else {
    x = lerp(start.x, end.x, t);
    y = lerp(start.y, end.y, t);
  }

  return {
    x,
    y,
    rotation: lerpAngle(start.rotation, end.rotation, t),
    isBlinking: start.isBlinking,
  };
};
