import { RelativeDirection } from '#simulation/types/index.js';

export default class Car {
    private readonly vehicleId: string;
    private readonly direction: RelativeDirection;

    constructor(
        vehicleId: string,
        direction: RelativeDirection,
    ) {
        this.vehicleId = vehicleId;
        this.direction = direction;
    }

    public getId() {
        return this.vehicleId;
    }
}
