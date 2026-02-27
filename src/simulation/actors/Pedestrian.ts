export default class Pedestrian {
    private readonly pedestrianId: string;

    constructor(pedestrianId: string) {
        this.pedestrianId = pedestrianId;
    }

    public getId() {
        return this.pedestrianId;
    }
}