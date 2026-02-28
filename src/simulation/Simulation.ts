import roadsFactory, { IntersectionDescription } from '#factories/roadsFactory.js';
import { worldAndWorldToRelativeDirection } from '#helpers/directionConversions.js';
import Car from './actors/Car.js';
import Pedestrian from './actors/Pedestrian.js';
import Controller from './controllers/Controller.js';
import controllers from './controllers/index.js';
import Intersection from './infrastructure/Intersection.js';
import { Command, ControllerTypes, RelativeDirection, TrafficLightsState, WorldDirection } from './types/index.js';

interface StepStatus {
    leftVehicles: string[];
    trafficLights: TrafficLightsState;
}

export default class Simulation {
    private readonly intersection: Intersection;
    private readonly controller: Controller;

    constructor(intersectionDescription: IntersectionDescription, controllerType: ControllerTypes) {
        this.intersection = new Intersection(roadsFactory(intersectionDescription));
        this.controller = controllers[controllerType];
    }

    public runCommand(command: Command): StepStatus | null {
        switch (command.type) {
            case 'step': {
                const lights = this.controller.step(this.intersection);
                // this is repeated 3 times because one step consists of 3 substeps
                // substep 1 lets cars drive from pre lights to post lights
                // substep 2 lets cars drive from post lights to pre crosswalk
                // substep 3 lets cars drive across the crosswalk
                let output = this.intersection.substep(lights);
                output = [...output, ...this.intersection.substep(lights)];
                output = [...output, ...this.intersection.substep(lights)];
                return { leftVehicles: output, trafficLights: lights };
            }
            case 'addVehicle': {
                const { vehicleId, startRoad, endRoad, laneIdx } = command;
                const car = new Car(vehicleId, this.getRelativeDir(startRoad, endRoad));
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

    public run(commands: Command[]): (StepStatus | null)[] {
        return commands.map((command) => this.runCommand(command));
    }

    private getRelativeDir(start: WorldDirection, end: WorldDirection): RelativeDirection {
        const roadMap = worldAndWorldToRelativeDirection[start] as Record<WorldDirection, RelativeDirection>;
        return roadMap[end];
    }
}
