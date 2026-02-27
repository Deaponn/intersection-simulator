import { Axis, RelativeDirection, TrafficLightsState } from '#simulation/types/index.js';

import InputLane from './InputLane.js';
import OutputLane from './OutputLane.js';

export default class Road {
    private inputLanes: InputLane[] = [];
    private outputLanes: OutputLane[] = [];
    private readonly axis: Axis;

    constructor(axis: Axis) {
        this.axis = axis;
    }

    public assignLanes(inputLanes: InputLane[], outputLanes: OutputLane[]) {
        this.inputLanes = inputLanes;
        this.outputLanes = outputLanes;
    }

    public decidePedestrians(lights: TrafficLightsState) {
        for (const lane of this.outputLanes) lane.decidePedestrians(lights);
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
        for (const lane of this.outputLanes) lane.walkPedestrians();
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

    public hasCarsDriving(direction: RelativeDirection): boolean {
        return this.inputLanes.some(lane => lane.hasCarInPostLights(direction));
    }

    public collectCompletedActors(): string[] {
        return this.outputLanes.flatMap((lane) => lane.collectOutputActors());
    }
}
