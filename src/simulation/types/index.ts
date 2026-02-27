import { axes, relativeDirections, worldDirections } from "#constants.js";
import controllers from "#simulation/controllers/index.js";

export type Axis = (typeof axes)[number];

export type WorldDirection = (typeof worldDirections)[number];

export type RelativeDirection = (typeof relativeDirections)[number];

export type TrafficArrowsState = Record<WorldDirection, boolean>;

export type ControllerTypes = keyof typeof controllers;

export interface TrafficLightsState {
    arrows: TrafficArrowsState;
    greenAxis: 'none' | Axis; // during axis change the value should be 'none' (both horizontal and vertical axes have yellow light)
}
