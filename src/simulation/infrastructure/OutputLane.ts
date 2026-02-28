import Car from '#simulation/actors/Car.js';
import Pedestrian from '#simulation/actors/Pedestrian.js';
import { Axis, TrafficLightsState } from '#simulation/types/index.js';

export default class OutputLane {
    private readonly axis: Axis;

    private pedestriansWaiting: Pedestrian[] = [];
    private pedestriansCrossed: Pedestrian[] = [];
    private willPedestriansCross = false;

    private preCrosswalkCar: Car | null = null;
    private postCrosswalkCar: Car | null = null;
    private willPreCrosswalkDrive = false;

    constructor(axis: Axis) {
        this.axis = axis;
    }

    public decidePedestrians(lights: TrafficLightsState) {
        this.willPedestriansCross = lights.greenAxis === this.axis;
    }

    public walkPedestrians() {
        if (!this.willPedestriansCross) return;
         // all pedestrians cross at the same time, in one simulation step
        this.pedestriansCrossed = this.pedestriansWaiting;
        this.pedestriansWaiting = [];
        this.willPedestriansCross = false;
    }

    public decidePreCrosswalk() {
        this.willPreCrosswalkDrive = !this.willPedestriansCross; // rule is simple: don't run over pedestrians :)
    }

    public drivePreCrosswalk() {
        if (!this.willPreCrosswalkDrive) return;
        this.postCrosswalkCar = this.preCrosswalkCar;
        this.preCrosswalkCar = null;
        this.willPreCrosswalkDrive = false;
    }

    public willHaveSpacePreCrosswalk(): boolean {
        return !this.preCrosswalkCar || this.willPreCrosswalkDrive;
    }

    public driveIntoPreCrosswalk(car: Car) {
        this.preCrosswalkCar = car;
    }

    public collectOutputActors(): string[] {
        const actorIds = this.pedestriansCrossed.map(pedestrian => pedestrian.getId());
        if (this.postCrosswalkCar) actorIds.push(this.postCrosswalkCar.getId());
        this.pedestriansCrossed = [];
        this.postCrosswalkCar = null;
        return actorIds;
    }
}
