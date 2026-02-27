import Car from '#simulation/actors/Car.js';
import Pedestrian from '#simulation/actors/Pedestrian.js';
import { Axis, TrafficLightsState } from '#simulation/types/index.js';

export default class OutputLane {
    private readonly axis: Axis;

    private readonly hasCrosswalk: boolean;
    private pedestriansWaiting: Pedestrian[] = [];
    private pedestriansCrossed: Pedestrian[] = [];
    private willPedestriansWalk = false;

    private preCrosswalkCar: Car | null = null;
    private postCrosswalkCar: Car | null = null;
    private willPreCrosswalkDrive = false;

    constructor(axis: Axis, hasCrosswalk: boolean) {
        this.axis = axis;
        this.hasCrosswalk = hasCrosswalk;
    }

    public decidePedestrians(lights: TrafficLightsState) {
        this.willPedestriansWalk = lights.greenAxis === this.axis;
    }

    public walkPedestrians() {
        if (this.willPedestriansWalk) { // all pedestrians cross at the same time, in one simulation step
            this.pedestriansCrossed = this.pedestriansWaiting;
            this.pedestriansWaiting = [];
        }
    }

    public decidePreCrosswalk() {
        this.willPreCrosswalkDrive = !this.willPedestriansWalk; // rule is simple: don't run over pedestrians :)
    }

    public drivePreCrosswalk() {
        if (!this.willPreCrosswalkDrive) return;
        this.postCrosswalkCar = this.preCrosswalkCar;
        this.preCrosswalkCar = null;
    }

    public collectOutputActors(): string[] {
        const actorIds = this.pedestriansCrossed.map(pedestrian => pedestrian.getId());
        if (this.postCrosswalkCar) actorIds.push(this.postCrosswalkCar.getId());
        this.pedestriansCrossed = [];
        this.postCrosswalkCar = null;
        return actorIds;
    }
}
