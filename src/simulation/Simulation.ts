import roadsFactory, { IntersectionDescription } from '#factories/roadsFactory.js';
import controllers from './controllers/index.js';
import Intersection from './infrastructure/Intersection.js';
import { ControllerTypes } from './types/index.js';

export default class Simulation {
    private readonly intersection: Intersection;

    constructor(intersectionDescription: IntersectionDescription, controllerType: ControllerTypes) {
        this.intersection = new Intersection(roadsFactory(intersectionDescription), controllers[controllerType]);
    }

    public step(): string {
        return '';
    }

    public run(): string[] {
        return [this.step(), this.step(), this.step()];
    }
}
