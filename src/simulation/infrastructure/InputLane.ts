import Car from '#simulation/actors/Car.js';
import { Direction } from '#simulation/types/index.js';

export default class Lane {
    private readonly preLightsCars: Car[] = [];
    private postLightsCar: Car | null = null;
    private destinationLanes: Record<Direction, Lane | null>;

    constructor(destinationLanes: Record<Direction, Lane | null>) {
        this.destinationLanes = destinationLanes;
    }
}
