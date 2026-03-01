import Car from '#simulation/actors/Car.js';
import Pedestrian from '#simulation/actors/Pedestrian.js';
import {
    IntersectionDescription,
    IntersectionSnapshot,
    RoadSide,
    TrafficLightsState,
    WorldDirection,
} from '#simulation/types/index.js';

import Road from './Road.js';

export default class Intersection {
    private readonly roads: Record<WorldDirection, Road>;

    constructor(roads: Record<WorldDirection, Road>) {
        this.roads = roads;
    }

    public substep(lights: TrafficLightsState): string[] {
        this.decideAboutDriving(lights);
        this.drive();
        return this.collectCompletedActors();
    }

    public driveIntoRoad(car: Car, road: WorldDirection, laneIdx?: number) {
        const startRoad = this.roads[road];
        laneIdx ??= startRoad.findSufficientLane(car.getDirection());
        if (laneIdx === -1) throw Error('There is no lane which satisfies this Car');
        this.roads[road].driveIntoLane(car, laneIdx);
    }

    public walkUpToCrosswalk(pedestrian: Pedestrian, road: WorldDirection, side: RoadSide) {
        this.roads[road].walkUpToCrosswalk(pedestrian, side);
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

    private collectCompletedActors(): string[] {
        return Object.values(this.roads).flatMap((road) => road.collectCompletedActors());
    }

    public getRoads() {
        return this.roads;
    }

    public collectSnapshot(): IntersectionSnapshot {
        return {
            north: this.roads.north.collectSnapshot(),
            east: this.roads.east.collectSnapshot(),
            south: this.roads.south.collectSnapshot(),
            west: this.roads.west.collectSnapshot(),
        };
    }

    public static basicIntersection(): IntersectionDescription {
        return {
            north: {
                lanes: [{ availableTurns: ['left', 'right', 'straightAhead'] }],
            },
            east: {
                lanes: [{ availableTurns: ['left', 'right', 'straightAhead'] }],
            },
            south: {
                lanes: [{ availableTurns: ['left', 'right', 'straightAhead'] }],
            },
            west: {
                lanes: [{ availableTurns: ['left', 'right', 'straightAhead'] }],
            },
        };
    }
}
