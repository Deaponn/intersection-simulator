import { PedestrianJson } from '#simulation/types/index.js';

export default class Pedestrian {
    private readonly pedestrianId: string;

    constructor(pedestrianId: string) {
        this.pedestrianId = pedestrianId;
    }

    public getId() {
        return this.pedestrianId;
    }

    public toJson(): PedestrianJson {
        return { pedestrianId: this.pedestrianId };
    }
}
