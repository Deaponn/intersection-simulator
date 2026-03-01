import Car from '#simulation/actors/Car.js';
import { OutputLanesSnapshot } from '#simulation/types/index.js';
import Road from './Road.js';

export default class OutputLane {
    private readonly road: Road;

    private preCrosswalkCar: Car | null = null;
    private postCrosswalkCar: Car | null = null;
    private willPreCrosswalkDrive = false;

    constructor(road: Road) {
        this.road = road;
    }

    public decidePreCrosswalk() {
        this.willPreCrosswalkDrive = !this.road.willPedestriansCrossFrom('left'); // the rule is simple: don't run over pedestrians :)
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

    public collectOutput(): string | null {
        const carId = this.postCrosswalkCar?.getId() ?? null;
        this.postCrosswalkCar = null;
        return carId;
    }

    public collectSnapshot(): OutputLanesSnapshot[number] {
        return {
            preCrosswalkCar: this.preCrosswalkCar?.toJson() ?? null,
            postCrosswalkCar: this.postCrosswalkCar?.toJson() ?? null,
        };
    }
}
