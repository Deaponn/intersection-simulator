import Controller from '#simulation/controllers/Controller.js';
import { TrafficLightsState, WorldDirection } from '#simulation/types/index.js';

import Road from './Road.js';

interface StepStatus {
    leftVehicles: string[];
    trafficLights: TrafficLightsState;
}

export default class Intersection {
    private readonly roads: Record<WorldDirection, Road>;
    private readonly controller: Controller;

    constructor(roads: Record<WorldDirection, Road>, controller: Controller) {
        this.roads = roads;
        this.controller = controller;
    }

    public step(): StepStatus {
        const lights = this.controller.step();
        Object.values(this.roads).forEach((road) => road.drivePreCrosswalk());
        Object.values(this.roads).forEach((road) =>
            road.drivePostLights(lights),
        );
        Object.values(this.roads).forEach((road) =>
            road.drivePreLights(lights),
        );
    }
}
