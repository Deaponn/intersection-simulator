import { axisOfDirection, worldAndRelativeToWorldDirection } from '#helpers/directionConversions.js';
import Car from '#simulation/actors/Car.js';
import {
    Axis,
    InputLanesSnapshot,
    RelativeDirection,
    TrafficLightsState,
    WorldDirection,
} from '#simulation/types/index.js';
import OutputLane from './OutputLane.js';
import Road from './Road.js';

export default class InputLane {
    private readonly position: WorldDirection;
    private readonly isRightmostLane: boolean;
    private readonly axis: Axis;
    private readonly otherRoads: Record<RelativeDirection, Road>;

    private readonly preLightsCars: Car[] = [];
    private postLightsCar: Car | null = null;
    private willPostLightsDrive = false;
    private willPreLightsDrive = false;

    private readonly relativeToWorldDirection: Record<RelativeDirection, WorldDirection>;
    private readonly destinationLanes: Record<WorldDirection, OutputLane | null> = {
        north: null,
        east: null,
        south: null,
        west: null,
    };

    constructor(position: WorldDirection, isRightmostLane: boolean, otherRoads: Record<WorldDirection, Road>) {
        this.position = position;
        this.isRightmostLane = isRightmostLane;
        this.axis = axisOfDirection[position];
        this.relativeToWorldDirection = worldAndRelativeToWorldDirection[this.position];
        this.otherRoads = {
            left: otherRoads[this.relativeToWorldDirection.left],
            right: otherRoads[this.relativeToWorldDirection.right],
            straightAhead: otherRoads[this.relativeToWorldDirection.straightAhead],
        };
    }

    public assignDestinationLane(direction: WorldDirection, lane: OutputLane) {
        this.destinationLanes[direction] = lane;
    }

    public canDrive(direction: RelativeDirection): boolean {
        return this.destinationLanes[this.relativeToWorldDirection[direction]] !== null;
    }

    public decidePostLights(lights: TrafficLightsState) {
        if (this.postLightsCar === null) return;

        const destination = this.relativeToWorldDirection[this.postLightsCar.getDirection()];
        const destinationLane = this.destinationLanes[destination];
        if (destinationLane === null) throw Error("This car's destination is unreachable from its current lane");
        if (!destinationLane.willHaveSpacePreCrosswalk()) return;

        switch (this.postLightsCar.getDirection()) {
            case 'right':
                this.willPostLightsDrive = this.checkIfRightTurnClear(lights);
                break;
            case 'straightAhead':
                this.willPostLightsDrive = this.checkIfStraightAheadClear(lights);
                break;
            case 'left':
                this.willPostLightsDrive = this.checkIfLeftTurnClear(lights);
                break;
        }

        this.willPostLightsDrive = true;
    }

    private checkIfRightTurnClear(lights: TrafficLightsState): boolean {
        if (lights.greenAxis === this.axis) return true;
        if (this.otherRoads.left.hasCarsDriving('straightAhead')) return false; // give way to others
        return true;
    }

    private checkIfStraightAheadClear(lights: TrafficLightsState): boolean {
        if (lights.greenAxis === this.axis) return true;
        if (
            this.otherRoads.right.hasCarsDriving('right') ||
            this.otherRoads.right.hasCarsDriving('straightAhead') ||
            this.otherRoads.right.hasCarsDriving('left') ||
            this.otherRoads.left.hasCarsDriving('straightAhead') ||
            this.otherRoads.left.hasCarsDriving('left')
        )
            return false; // give way to others
        return true;
    }

    private checkIfLeftTurnClear(lights: TrafficLightsState): boolean {
        if (
            lights.greenAxis === this.axis &&
            !this.otherRoads.straightAhead.hasCarsDriving('right') &&
            !this.otherRoads.straightAhead.hasCarsDriving('straightAhead')
        )
            return true;
        if (
            this.otherRoads.right.hasCarsDriving('straightAhead') ||
            this.otherRoads.right.hasCarsDriving('left') ||
            this.otherRoads.straightAhead.hasCarsDriving('right') ||
            this.otherRoads.straightAhead.hasCarsDriving('straightAhead') ||
            this.otherRoads.straightAhead.hasCarsDriving('left') ||
            this.otherRoads.left.hasCarsDriving('straightAhead') ||
            this.otherRoads.left.hasCarsDriving('left')
        )
            return false; // give way to others
        return true;
    }

    public decidePreLights(lights: TrafficLightsState) {
        if (this.postLightsCar !== null && !this.willPostLightsDrive) return;
        if (lights.greenAxis === this.axis || (this.isRightmostLane && lights.arrows[this.position]))
            this.willPreLightsDrive = true;
    }

    public drivePostLights() {
        if (this.postLightsCar === null) return;

        const destination = this.relativeToWorldDirection[this.postLightsCar.getDirection()];
        const destinationLane = this.destinationLanes[destination];
        if (destinationLane === null) throw Error("This car's destination is unreachable from its current lane");

        destinationLane.driveIntoPreCrosswalk(this.postLightsCar);
        this.postLightsCar = null;
        this.willPostLightsDrive = false;
    }

    public drivePreLights() {
        if (!this.willPreLightsDrive) return;
        const car = this.preLightsCars.shift();
        if (car === undefined) return;
        this.postLightsCar = car;
        this.willPreLightsDrive = false;
    }

    public driveIntoPreLights(car: Car) {
        this.preLightsCars.push(car);
    }

    public hasCarInPostLights(direction: RelativeDirection): boolean {
        return !!this.postLightsCar && this.postLightsCar.getDirection() === direction;
    }

    public collectSnapshot(): InputLanesSnapshot[number] {
        return {
            preLightsCars: this.preLightsCars.map((car) => car.toJson()),
            postLightsCar: this.postLightsCar?.toJson() ?? null,
        };
    }
}
