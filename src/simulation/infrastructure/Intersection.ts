import Road from './Road.js';

export default class Intersection {
    private readonly north: Road;
    private readonly east: Road;
    private readonly south: Road;
    private readonly west: Road;

    constructor(north: Road, east: Road, south: Road, west: Road) {
        this.north = north;
        this.east = east;
        this.south = south;
        this.west = west;
    }
}
