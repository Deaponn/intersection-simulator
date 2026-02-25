import Car from "#simulation/actors/Car.js";
import Pedestrian from "#simulation/actors/Pedestrian.js";

export default class OutputLane {
    private readonly hasCrosswalk: boolean;
    private readonly pedestriansWaiting: Pedestrian[] = [];
    private readonly pedestriansCrossed: Pedestrian[] = [];

    private preCrosswalkCar: Car | null = null;
    private readonly postCrosswalkCars: Car[] = [];

    constructor(hasCrosswalk: boolean) {
        this.hasCrosswalk = hasCrosswalk;
    }
}
