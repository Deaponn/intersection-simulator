import type {
  Command,
  IntersectionDescription,
  RoadDescription,
} from "../types/index";

const standardRoad: RoadDescription = {
  lanes: [
    { availableTurns: ["left", "straightAhead"] as const },
    { availableTurns: ["straightAhead", "right"] as const },
  ],
};

export const PRESETS: Record<
  string,
  {
    name: string;
    description: string;
    intersectionDescription: IntersectionDescription;
    commands: Command[];
  }
> = {
  "standard-4-way": {
    name: "Standard 4-Way",
    description:
      "Two lanes on every side. Left lane turns left/straight, right lane turns straight/right.",
    intersectionDescription: {
      north: standardRoad,
      east: standardRoad,
      south: standardRoad,
      west: standardRoad,
    },
    commands: [
      {
        type: "addVehicle",
        vehicleId: "vehicle1",
        startRoad: "north",
        endRoad: "south",
        laneIdx: 0,
      },
      {
        type: "addVehicle",
        vehicleId: "vehicle2",
        startRoad: "north",
        endRoad: "south",
        laneIdx: 1,
      },
      {
        type: "addVehicle",
        vehicleId: "vehicle3",
        startRoad: "north",
        endRoad: "east",
        laneIdx: 0,
      },
      {
        type: "addVehicle",
        vehicleId: "vehicle4",
        startRoad: "north",
        endRoad: "west",
        laneIdx: 1,
      },
      {
        type: "step",
      },
      {
        type: "addPedestrian",
        pedestrianId: "pedestrian1",
        roadToCross: "east",
        startSide: "right",
      },
      {
        type: "step",
      },
      {
        type: "addPedestrian",
        pedestrianId: "pedestrian2",
        roadToCross: "west",
        startSide: "right",
      },
      {
        type: "step",
      },
      {
        type: "step",
      },
      {
        type: "step",
      },
      {
        type: "step",
      },
    ],
  },
};
