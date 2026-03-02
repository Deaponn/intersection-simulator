import { create } from "zustand";
import type {
  IntersectionDescription,
  Command,
  WorldDirection,
  RelativeDirection,
  SimulationOutput,
  ControllerTypes,
  RoadDescription,
} from "../types/index";

interface SimulationState {
  intersectionDescription: IntersectionDescription;
  controllerType: ControllerTypes | null;
  commands: Command[];
  simulationOutput: SimulationOutput | null;

  setIntersectionPreset: (preset: IntersectionDescription) => void;
  setLaneCount: (road: WorldDirection, count: number) => void;
  setLaneTurns: (
    road: WorldDirection,
    laneIndex: number,
    turns: RelativeDirection[],
  ) => void;
  setControllerType: (type: ControllerTypes) => void;
  addCommand: (command: Command) => void;
  removeCommand: (index: number) => void;
  setSimulationOutput: (output: SimulationOutput) => void;
}

// default 1-lane road
const createDefaultRoad: () => RoadDescription = () => ({
  lanes: [{ availableTurns: ["straightAhead"] }],
});

export const useSimulationStore = create<SimulationState>((set) => ({
  intersectionDescription: {
    north: createDefaultRoad(),
    east: createDefaultRoad(),
    south: createDefaultRoad(),
    west: createDefaultRoad(),
  },
  controllerType: "simple-controller",
  commands: [],
  simulationOutput: null,

  setIntersectionPreset: (preset) => set({ intersectionDescription: preset }),

  setLaneCount: (road, count) =>
    set((state) => {
      const currentLanes = state.intersectionDescription[road].lanes;
      let newLanes = [...currentLanes];

      if (count > currentLanes.length) {
        const addedLanes = Array(count - currentLanes.length).fill({
          availableTurns: ["straightAhead"],
        });
        newLanes = [...newLanes, ...addedLanes];
      } else if (count < currentLanes.length) {
        newLanes = newLanes.slice(0, count);
      }

      return {
        intersectionDescription: {
          ...state.intersectionDescription,
          [road]: { lanes: newLanes },
        },
      };
    }),

  setLaneTurns: (road, laneIndex, turns) =>
    set((state) => {
      const newLanes = [...state.intersectionDescription[road].lanes];
      newLanes[laneIndex] = { availableTurns: turns };
      return {
        intersectionDescription: {
          ...state.intersectionDescription,
          [road]: { lanes: newLanes },
        },
      };
    }),

  setControllerType: (type) => set({ controllerType: type }),
  addCommand: (command) =>
    set((state) => ({ commands: [...state.commands, command] })),
  removeCommand: (index) =>
    set((state) => ({
      commands: state.commands.filter((_, i) => i !== index),
    })),
  setSimulationOutput: (output) => set({ simulationOutput: output }),
}));
