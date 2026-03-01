import type { IntersectionDescription, RoadDescription } from "../types/index";

const standardRoad: RoadDescription = {
  lanes: [
    { availableTurns: ["left", "straightAhead"] as const },
    { availableTurns: ["straightAhead", "right"] as const },
  ],
};

export const PRESETS: Record<
  string,
  { name: string; description: string; data: IntersectionDescription }
> = {
  "standard-4-way": {
    name: "Standard 4-Way",
    description:
      "Two lanes on every side. Left lane turns left/straight, right lane turns straight/right.",
    data: {
      north: standardRoad,
      east: standardRoad,
      south: standardRoad,
      west: standardRoad,
    },
  },
};
