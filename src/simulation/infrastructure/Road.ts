import { axisOfDirection, oppositeAxis } from '#helpers/directionConversions.js';
import Car from '#simulation/actors/Car.js';
import Pedestrian from '#simulation/actors/Pedestrian.js';
import { Axis, RelativeDirection, RoadSide, TrafficLightsState, WorldDirection } from '#simulation/types/index.js';

import InputLane from './InputLane.js';
import OutputLane from './OutputLane.js';

export default class Road {
    private inputLanes: InputLane[] = [];
    private outputLanes: OutputLane[] = [];
    private readonly axis: Axis;

    private static PEDESTRIAN_SUBSTEP_SPEED = 3;
    private pedestriansWaiting: Record<RoadSide, Pedestrian[]> = { left: [], right: [] };
    private pedestriansCrossed: Pedestrian[] = [];
    private willPedestriansCross = false;
    private pedestrianCrossingProgress = Road.PEDESTRIAN_SUBSTEP_SPEED;

    constructor(position: WorldDirection) {
        this.axis = axisOfDirection[position];
    }

    public assignLanes(inputLanes: InputLane[], outputLanes: OutputLane[]) {
        this.inputLanes = inputLanes;
        this.outputLanes = outputLanes;
    }

    public decidePedestrians(lights: TrafficLightsState) {
        this.willPedestriansCross = lights.greenAxis === oppositeAxis[this.axis];
    }

    public decidePreCrosswalk() {
        for (const lane of this.outputLanes) lane.decidePreCrosswalk();
    }

    public decidePostLights(lights: TrafficLightsState) {
        for (const lane of this.inputLanes) lane.decidePostLights(lights);
    }

    public decidePreLights(lights: TrafficLightsState) {
        for (const lane of this.inputLanes) lane.decidePreLights(lights);
    }

    public walkPedestrians() {
        this.pedestrianCrossingProgress--;
        if (this.pedestrianCrossingProgress !== 0) return; // artificially prolong the timing of pedestrians crossing
        if (!this.willPedestriansCross) return;
        // all pedestrians cross at the same time, in one simulation step
        this.pedestriansCrossed = [...this.pedestriansWaiting.left, ...this.pedestriansWaiting.right];
        this.pedestriansWaiting.left = [];
        this.pedestriansWaiting.right = [];
        this.willPedestriansCross = false;
    }

    public drivePreCrosswalk() {
        for (const lane of this.outputLanes) lane.drivePreCrosswalk();
    }

    public drivePostLights() {
        for (const lane of this.inputLanes) lane.drivePostLights();
    }

    public drivePreLights() {
        for (const lane of this.inputLanes) lane.drivePreLights();
    }

    public driveIntoLane(car: Car, laneIdx: number) {
        this.inputLanes[laneIdx].driveIntoPreLights(car);
    }

    public walkUpToCrosswalk(pedestrian: Pedestrian, side: RoadSide) {
        this.pedestriansWaiting[side].push(pedestrian);
    }

    public willPedestriansCrossFrom(side: RoadSide) {
        return this.willPedestriansCross && this.pedestriansWaiting[side].length > 0;
    }

    public hasCarsDriving(direction: RelativeDirection): boolean {
        return this.inputLanes.some((lane) => lane.hasCarInPostLights(direction));
    }

    public findSufficientLane(direction: RelativeDirection): number {
        // looping from right to left, because the traffic in Poland is right-handed
        for (let idx = this.inputLanes.length - 1; idx >= 0; idx--) {
            if (this.inputLanes[idx].canDrive(direction)) return idx;
        }
        return -1;
    }

    public collectCompletedActors(): string[] {
        const actorIds = this.pedestriansCrossed.map((pedestrian) => pedestrian.getId());
        this.pedestriansCrossed = [];
        return [...actorIds, ...this.outputLanes.flatMap((lane) => lane.collectOutput()).filter((id) => id !== null)];
    }
}
