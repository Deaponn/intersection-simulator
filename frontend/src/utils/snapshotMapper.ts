import type { Snapshot, WorldDirection } from "../types/index";
import {
  LANE_WIDTH,
  CAR_LENGTH,
  STOP_LINE_DIST,
  INTERSECTION_RADIUS,
  directionAngles,
  CROSSWALK_DEPTH,
} from "./geometry";

export interface CarRenderState {
  id: string;
  x: number;
  y: number;
  rotation: number;
  isBlinking: "left" | "right" | "none";
}

export interface PedRenderState {
  id: string;
  x: number;
  y: number;
}

const toGlobal = (
  localX: number,
  localY: number,
  direction: WorldDirection,
) => {
  const angle = directionAngles[direction] * (Math.PI / 180);
  return {
    x: localX * Math.cos(angle) - localY * Math.sin(angle),
    y: localX * Math.sin(angle) + localY * Math.cos(angle),
  };
};

export const flattenSnapshot = (
  snapshot: Snapshot,
): { cars: Map<string, CarRenderState>; peds: Map<string, PedRenderState> } => {
  const cars = new Map<string, CarRenderState>();
  const peds = new Map<string, PedRenderState>();

  const directions: WorldDirection[] = ["north", "east", "south", "west"];

  directions.forEach((dir) => {
    const road = snapshot.intersectionState[dir];
    const baseRotation = directionAngles[dir];

    road.inputLanes.forEach((lane, laneIdx) => {
      const laneCenterX = -(laneIdx + 0.5) * LANE_WIDTH;

      lane.preLightsCars.forEach((car, queueIdx) => {
        const localY = -STOP_LINE_DIST - queueIdx * (CAR_LENGTH + 10) - 30;
        const global = toGlobal(laneCenterX, localY, dir);

        cars.set(car.vehicleId, {
          id: car.vehicleId,
          ...global,
          rotation: baseRotation + 180,
          isBlinking:
            car.direction === "left" || car.direction === "right"
              ? car.direction
              : "none",
        });
      });

      if (lane.postLightsCar) {
        const localY = -INTERSECTION_RADIUS + 20;
        const global = toGlobal(laneCenterX, localY, dir);
        cars.set(lane.postLightsCar.vehicleId, {
          id: lane.postLightsCar.vehicleId,
          ...global,
          rotation: baseRotation + 180,
          isBlinking:
            lane.postLightsCar.direction === "left" ||
            lane.postLightsCar.direction === "right"
              ? lane.postLightsCar.direction
              : "none",
        });
      }
    });

    road.outputLanes.forEach((lane, laneIdx) => {
      const laneCenterX = (laneIdx + 0.5) * LANE_WIDTH;

      if (lane.preCrosswalkCar) {
        const localY = -INTERSECTION_RADIUS + 10;
        const global = toGlobal(laneCenterX, localY, dir);
        cars.set(lane.preCrosswalkCar.vehicleId, {
          id: lane.preCrosswalkCar.vehicleId,
          ...global,
          rotation: baseRotation,
          isBlinking: "none",
        });
      }

      if (lane.postCrosswalkCar) {
        const localY = -STOP_LINE_DIST - 40;
        const global = toGlobal(laneCenterX, localY, dir);
        cars.set(lane.postCrosswalkCar.vehicleId, {
          id: lane.postCrosswalkCar.vehicleId,
          ...global,
          rotation: baseRotation,
          isBlinking: "none",
        });
      }
    });

    road.pedestrians.left.forEach((ped, i) => {
      const localX = road.outputLanes.length * LANE_WIDTH + 20 + i * 10;
      const localY = -INTERSECTION_RADIUS - CROSSWALK_DEPTH / 2;
      peds.set(ped.pedestrianId, {
        id: ped.pedestrianId,
        ...toGlobal(localX, localY, dir),
      });
    });

    road.pedestrians.right.forEach((ped, i) => {
      const localX = -(road.inputLanes.length * LANE_WIDTH) - 20 - i * 10;
      const localY = -INTERSECTION_RADIUS - CROSSWALK_DEPTH / 2;
      peds.set(ped.pedestrianId, {
        id: ped.pedestrianId,
        ...toGlobal(localX, localY, dir),
      });
    });
  });

  return { cars, peds };
};
