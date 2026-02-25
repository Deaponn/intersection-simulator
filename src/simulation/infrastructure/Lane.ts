import Car from '#simulation/actors/Car.js';

export default class Road {
    private waitingCars: Car[] = [];
    private postLights: Car | null = null;
}
