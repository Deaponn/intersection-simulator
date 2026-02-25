import Controller from '#simulation/controllers/Controller.js';
import { Destination, TrafficLightsState } from '#simulation/types/index.js';

import Road from './Road.js';

interface StepStatus {
    leftVehicles: string[];
    trafficLights: TrafficLightsState;
}

export default class Intersection {
    private readonly roads: Record<Destination, Road>;
    private readonly controller: Controller;

    constructor(
        north: Road,
        east: Road,
        south: Road,
        west: Road,
        controller: Controller,
    ) {
        this.roads = {
            East: east,
            North: north,
            South: south,
            West: west,
        };
        this.controller = controller;
    }

    public step(): StepStatus {
        const lights = this.controller.step();
        Object.values(this.roads).forEach((road) => road.drivePreCrosswalk());
        Object.values(this.roads).forEach((road) => road.drivePostLights(lights));
        Object.values(this.roads).forEach((road) => road.drivePreLights(lights));
    }
}
