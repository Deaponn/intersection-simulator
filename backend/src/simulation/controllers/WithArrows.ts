import { TrafficLightsState } from '#simulation/types/index.js';
import Controller from './Controller.js';

export default class WithArrows extends Controller {
    private time = 0;
    private isVerticalGreen = true;

    public step(): TrafficLightsState {
        this.time++;

        if (this.time % 4 === 0) {
            this.isVerticalGreen = !this.isVerticalGreen;
            return { arrows: this.redArrows(), greenAxis: 'none' };
        }

        const isLastTick = this.time % 4 === 3;

        return {
            arrows: {
                north: !this.isVerticalGreen && isLastTick,
                south: !this.isVerticalGreen && isLastTick,
                east: this.isVerticalGreen && isLastTick,
                west: this.isVerticalGreen && isLastTick,
            },
            greenAxis: this.isVerticalGreen ? 'vertical' : 'horizontal',
        };
    }
}
