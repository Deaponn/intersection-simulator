import { axes, relativeDirections, roadSides, worldDirections } from '#constants.js';
import Car from '#simulation/actors/Car.js';
import Pedestrian from '#simulation/actors/Pedestrian.js';
import controllers from '#simulation/controllers/index.js';

type AddVehicleCommand = {
    [S in WorldDirection]: {
        type: 'addVehicle';
        vehicleId: string;
        startRoad: S;
        endRoad: Exclude<WorldDirection, S>;
        laneIdx?: number;
    };
}[WorldDirection];

interface AddPedestrianCommand {
    type: 'addPedestrian';
    pedestrianId: string;
    roadToCross: WorldDirection;
    startSide: RoadSide;
}

export type Command = { type: 'step' } | AddVehicleCommand | AddPedestrianCommand;

interface LaneDescription {
    availableTurns: RelativeDirection[];
}

interface RoadDescription {
    lanes: LaneDescription[];
}

export type IntersectionDescription = Record<WorldDirection, RoadDescription>;

export interface SimulationDescription {
    intersectionDescription?: IntersectionDescription;
    controllerType?: ControllerTypes;
    commands: Command[];
}

export type Axis = (typeof axes)[number];

export type WorldDirection = (typeof worldDirections)[number];

export type RelativeDirection = (typeof relativeDirections)[number];

export type RoadSide = (typeof roadSides)[number];

export type TrafficArrowsState = Record<WorldDirection, boolean>;

export type ControllerTypes = keyof typeof controllers;

export interface TrafficLightsState {
    arrows: TrafficArrowsState;
    greenAxis: 'none' | Axis; // during axis change the value should be 'none' (both horizontal and vertical axes have yellow light)
}

interface InputLaneSnapshot {
    preLightsCars: Car[];
    postLightsCar: Car | null;
}

interface OutputLaneSnapshot {
    preCrosswalkCar: Car | null;
    postCrosswalkCar: Car[];
}

interface RoadSnapshot {
    pedestrians: Record<RoadSide, Pedestrian[]>;
    inputLanes: InputLaneSnapshot[];
    outputLanes: OutputLaneSnapshot[];
}

export type IntersectionSnapshot = Record<WorldDirection, RoadSnapshot>;

export interface Snapshot {
    lights: TrafficLightsState;
    intersectionState: IntersectionSnapshot;
    actorsLeft: string[];
}
