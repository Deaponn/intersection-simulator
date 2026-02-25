import Intersection from '#simulation/infrastructure/Intersection.js';
import { TrafficLightsState } from '#simulation/types/index.js';

import Controller from './Controller.js';

export default class SimpleController extends Controller {
    private readonly intersection: Intersection;
    private time = 0;
    private isVerticalGreen = true;

    constructor(intersection: Intersection) {
        super();
        this.intersection = intersection;
    }

    public step(): TrafficLightsState {
        this.time++;
        if (this.time % 4 === 0) {
            this.isVerticalGreen = !this.isVerticalGreen;
            return { arrows: this.redArrows(), greenAxis: 'none' };
        }
        return {
            arrows: this.redArrows(),
            greenAxis: this.isVerticalGreen ? 'vertical' : 'horizontal',
        };
    }
}
