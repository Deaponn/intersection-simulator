import { axes, relativeDirections, roadSides, worldDirections } from '#constants.js';
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
