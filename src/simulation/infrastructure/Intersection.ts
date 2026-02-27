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
        const lights = this.controller.step(this);
        this.decideAboutDriving(lights);
        this.drive();
        return this.collectCompletedActors(lights);
    }

    private decideAboutDriving(lights: TrafficLightsState) {
        Object.values(this.roads).forEach((road) => {
            road.decidePedestrians(lights);
        });
        Object.values(this.roads).forEach((road) => {
            road.decidePreCrosswalk();
        });
        Object.values(this.roads).forEach((road) => {
            road.decidePostLights(lights);
        });
        Object.values(this.roads).forEach((road) => {
            road.decidePreLights(lights);
        });
    }

    private drive() {
        Object.values(this.roads).forEach((road) => {
            road.walkPedestrians();
        });
        Object.values(this.roads).forEach((road) => {
            road.drivePreCrosswalk();
        });
        Object.values(this.roads).forEach((road) => {
            road.drivePostLights();
        });
        Object.values(this.roads).forEach((road) => {
            road.drivePreLights();
        });
    }

    private collectCompletedActors(lights: TrafficLightsState): StepStatus {
        return {
            trafficLights: lights,
            leftVehicles: Object.values(this.roads).flatMap((road) => road.collectCompletedActors()),
        };
    }

    public getRoads() {
        return this.roads;
    }
}
