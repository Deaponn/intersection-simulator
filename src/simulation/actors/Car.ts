import { Destination, Direction } from '#types/index.js';

export default class Car {
    private readonly vehicleId: string;
    private readonly destination: Destination;
    private readonly direction: Direction;

    constructor(
        vehicleId: string,
        destination: Destination,
        direction: Direction,
    ) {
        this.vehicleId = vehicleId;
        this.destination = destination;
        this.direction = direction;
    }
}
