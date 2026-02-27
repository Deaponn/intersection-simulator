import Car from '#simulation/actors/Car.js';
import { WorldDirection } from '#simulation/types/index.js';
import OutputLane from './OutputLane.js';

export default class InputLane {
    private readonly preLightsCars: Car[] = [];
    private postLightsCar: Car | null = null;
    private readonly destinationLanes: Record<WorldDirection, OutputLane | null> = {
        north: null,
        east: null,
        south: null,
        west: null,
    };

    public assignDestinationLane(direction: WorldDirection, lane: OutputLane) {
        this.destinationLanes[direction] = lane;
    }

    public drivePreLights(canDrive: boolean) {
        if (!canDrive) return;
        const car = this.preLightsCars.shift();
        if (car === undefined || this.postLightsCar !== null) return;
        this.postLightsCar = car;
    }
}
