import { Axis } from '#simulation/types/index.js';

import InputLane from './InputLane.js';
import OutputLane from './OutputLane.js';

export default class Road {
    private readonly inputLanes: InputLane[];
    private readonly outputLanes: OutputLane[];
    private readonly axis: Axis;

    constructor(
        axis: Axis,
        inputLanes: InputLane[],
        outputLanes: OutputLane[],
    ) {
        this.axis = axis;
        this.inputLanes = inputLanes;
        this.outputLanes = outputLanes;
    }
}
