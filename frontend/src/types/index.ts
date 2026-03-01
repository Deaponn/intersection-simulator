import {
  axes,
  relativeDirections,
  roadSides,
  worldDirections,
  controllerTypes,
} from "../constants";

export type WorldDirection = (typeof worldDirections)[number];
export type RelativeDirection = (typeof relativeDirections)[number];
export type RoadSide = (typeof roadSides)[number];
export type Axis = (typeof axes)[number];
export type ControllerTypes = (typeof controllerTypes)[number];

export interface AddVehicleCommand {
  type: "addVehicle";
  vehicleId: string;
  startRoad: WorldDirection;
  endRoad: WorldDirection;
  laneIdx?: number;
}

export interface AddPedestrianCommand {
  type: "addPedestrian";
  pedestrianId: string;
  roadToCross: WorldDirection;
  startSide: RoadSide;
}

export type Command =
  | { type: "step" }
  | AddVehicleCommand
  | AddPedestrianCommand;

export interface LaneDescription {
  availableTurns: RelativeDirection[];
}

export interface RoadDescription {
  lanes: LaneDescription[];
}

export type IntersectionDescription = Record<WorldDirection, RoadDescription>;

export interface SimulationDescription {
  intersectionDescription?: IntersectionDescription;
  controllerType?: ControllerTypes;
  commands: Command[];
}

export type TrafficArrowsState = Record<WorldDirection, boolean>;

export interface TrafficLightsState {
  arrows: TrafficArrowsState;
  greenAxis: "none" | Axis;
}

export interface StepStatus {
  leftVehicles: string[];
}

export interface PedestrianJson {
  pedestrianId: string;
}

export interface CarJson {
  vehicleId: string;
  direction: RelativeDirection;
}

export interface OutputLaneSnapshot {
  preCrosswalkCar: CarJson | null;
  postCrosswalkCar: CarJson | null;
}

export type OutputLanesSnapshot = OutputLaneSnapshot[];

export interface InputLaneSnapshot {
  preLightsCars: CarJson[];
  postLightsCar: CarJson | null;
}

export type InputLanesSnapshot = InputLaneSnapshot[];

export interface RoadSnapshot {
  pedestrians: Record<RoadSide, PedestrianJson[]>;
  inputLanes: InputLanesSnapshot;
  outputLanes: OutputLanesSnapshot;
}

export type IntersectionSnapshot = Record<WorldDirection, RoadSnapshot>;

export interface Snapshot {
  lights: TrafficLightsState;
  intersectionState: IntersectionSnapshot;
  actorsLeft: string[];
}

export interface SimulationOutput {
  snapshots: Snapshot[];
}
