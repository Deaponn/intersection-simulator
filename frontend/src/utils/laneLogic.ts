import type {
  LaneDescription,
  WorldDirection,
  RelativeDirection,
} from "../types/index";

export const getDisabledTurns = (
  lanes: LaneDescription[],
  laneIndex: number,
) => {
  let disabledLeft = false;
  let disabledStraightAhead = false;
  let disabledRight = false;

  // Check lanes to the left
  for (let i = 0; i < laneIndex; i++) {
    const turns = lanes[i].availableTurns;
    if (turns.includes("straightAhead") || turns.includes("right")) {
      disabledLeft = true;
    }
    if (turns.includes("right")) {
      disabledStraightAhead = true;
    }
  }

  // Check lanes to the right
  for (let i = laneIndex + 1; i < lanes.length; i++) {
    const turns = lanes[i].availableTurns;
    if (turns.includes("left") || turns.includes("straightAhead")) {
      disabledRight = true;
    }
    if (turns.includes("left")) {
      disabledStraightAhead = true;
    }
  }

  return {
    left: disabledLeft,
    straightAhead: disabledStraightAhead,
    right: disabledRight,
  };
};

export const getTurnDirection = (
  startRoad: WorldDirection,
  endRoad: WorldDirection,
): RelativeDirection | null => {
  if (startRoad === endRoad) return null; // u-turns not allowed

  const turnMap: Record<WorldDirection, Record<string, RelativeDirection>> = {
    north: { south: "straightAhead", east: "left", west: "right" },
    east: { west: "straightAhead", south: "left", north: "right" },
    south: { north: "straightAhead", west: "left", east: "right" },
    west: { east: "straightAhead", north: "left", south: "right" },
  };

  return turnMap[startRoad][endRoad];
};
