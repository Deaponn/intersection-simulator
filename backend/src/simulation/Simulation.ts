import roadsFactory from '#factories/roadsFactory.js';
import { worldAndWorldToRelativeDirection } from '#helpers/directionConversions.js';
import Car from './actors/Car.js';
import Pedestrian from './actors/Pedestrian.js';
import Controller from './controllers/Controller.js';
import controllers from './controllers/index.js';
import Intersection from './infrastructure/Intersection.js';
import {
    Command,
    ControllerTypes,
    IntersectionDescription,
    IntersectionSnapshot,
    RelativeDirection,
    SimulationOutput,
    Snapshot,
    StepStatus,
    TrafficLightsState,
    WorldDirection,
} from './types/index.js';

export default class Simulation {
    private readonly intersection: Intersection;
    private readonly controller: Controller;
    private lights: TrafficLightsState = {
        arrows: { north: false, east: false, south: false, west: false },
        greenAxis: 'none',
    };

    constructor(intersectionDescription: IntersectionDescription, controllerType: ControllerTypes) {
        this.intersection = new Intersection(roadsFactory(intersectionDescription));
        this.controller = controllers[controllerType]();
    }

    public runCommand(command: Command): StepStatus | null {
        switch (command.type) {
            case 'step': {
                this.lights = this.controller.step(this.intersection);
                const leftVehicles = this.intersection.substep(this.lights);
                return { leftVehicles };
            }
            case 'addVehicle': {
                const { vehicleId, startRoad, endRoad, laneIdx } = command;
                const car = new Car(vehicleId, Simulation.getRelativeDir(startRoad, endRoad));
                this.intersection.driveIntoRoad(car, startRoad, laneIdx);
                return null;
            }
            case 'addPedestrian': {
                const { pedestrianId, roadToCross, startSide } = command;
                const pedestrian = new Pedestrian(pedestrianId);
                this.intersection.walkUpToCrosswalk(pedestrian, roadToCross, startSide);
                return null;
            }
        }
    }

    public run(commands: Command[]): StepStatus[] {
        return commands.map((command) => this.runCommand(command)).filter((status) => status !== null);
    }

    public runWithSnapshot(commands: Command[]): SimulationOutput {
        const snapshots: Snapshot[] = [];

        for (const command of commands) {
            const commandOutput = this.runCommand(command);
            const { leftVehicles: actorsLeft } = commandOutput ?? { leftVehicles: [] };
            const intersectionState = this.collectSnapshot();
            const snapshot: Snapshot = {
                intersectionState,
                actorsLeft,
                lights: this.lights,
            };
            snapshots.push(snapshot);
        }

        return { snapshots };
    }

    private collectSnapshot(): IntersectionSnapshot {
        return this.intersection.collectSnapshot();
    }

    private static getRelativeDir(start: WorldDirection, end: WorldDirection): RelativeDirection {
        const roadMap = worldAndWorldToRelativeDirection[start] as Record<WorldDirection, RelativeDirection>;
        return roadMap[end];
    }
}
