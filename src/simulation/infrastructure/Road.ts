import Lane from './Lane.js';

export default class Road {
    private readonly lanes: Lane[];

    constructor(lanes: Lane[]) {
        this.lanes = lanes;
    }
}
