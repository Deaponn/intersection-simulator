import type { IntersectionDescription, RelativeDirection, WorldDirection } from "../types/index";

export const LANE_WIDTH = 40;
export const CROSSWALK_DEPTH = 30;
export const PRE_CROSSWALK_GAP = 60;
export const CAR_LENGTH = 45;
export const CAR_WIDTH = 20;
export const INTERSECTION_RADIUS = 200;
export const STOP_LINE_DIST =
  INTERSECTION_RADIUS + CROSSWALK_DEPTH + PRE_CROSSWALK_GAP;

export const calculateOutputLanes = (
  desc: IntersectionDescription,
  targetRoad: WorldDirection,
): number => {
  const getTurnCount = (
    fromRoad: WorldDirection,
    turn: RelativeDirection,
  ) => {
    return (
      desc[fromRoad]?.lanes.filter((l) => l.availableTurns.includes(turn))
        .length || 0
    );
  };

  switch (targetRoad) {
    case "north":
      return Math.max(
        getTurnCount("south", "straightAhead"),
        getTurnCount("east", "right"),
        getTurnCount("west", "left"),
      );
    case "south":
      return Math.max(
        getTurnCount("north", "straightAhead"),
        getTurnCount("west", "right"),
        getTurnCount("east", "left"),
      );
    case "east":
      return Math.max(
        getTurnCount("west", "straightAhead"),
        getTurnCount("north", "left"),
        getTurnCount("south", "right"),
      );
    case "west":
      return Math.max(
        getTurnCount("east", "straightAhead"),
        getTurnCount("south", "left"),
        getTurnCount("north", "right"),
      );
    default:
      return 1;
  }
};

export const directionAngles: Record<WorldDirection, number> = {
  north: 0,
  east: 90,
  south: 180,
  west: 270,
};
