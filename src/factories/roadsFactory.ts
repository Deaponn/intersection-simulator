import { worldDirections } from '#constants.js';
import { worldAndRelativeToWorldDirection } from '#helpers/directionConversions.js';
import InputLane from '#simulation/infrastructure/InputLane.js';
import OutputLane from '#simulation/infrastructure/OutputLane.js';
import Road from '#simulation/infrastructure/Road.js';
import { RelativeDirection, WorldDirection } from '#simulation/types/index.js';

interface LaneDescription {
    availableTurns: RelativeDirection[];
}

interface RoadDescription {
    lanes: LaneDescription[];
    hasCrosswalk: boolean;
}

export type IntersectionDescription = Record<WorldDirection, RoadDescription>;

const roadsFactory: (intersectionDescription: IntersectionDescription) => Record<WorldDirection, Road> = (
    intersectionDescription: IntersectionDescription,
) => {
    const allInputLanes: Record<WorldDirection, InputLane[]> = {
        north: Array.from({ length: intersectionDescription.north.lanes.length }, () => new InputLane()),
        east: Array.from({ length: intersectionDescription.east.lanes.length }, () => new InputLane()),
        south: Array.from({ length: intersectionDescription.south.lanes.length }, () => new InputLane()),
        west: Array.from({ length: intersectionDescription.west.lanes.length }, () => new InputLane()),
    };

    const allOutputLanes: Record<WorldDirection, OutputLane[]> = {
        north: [],
        east: [],
        south: [],
        west: [],
    };

    for (const worldDirection of worldDirections) {
        const outputLanesCounters: Record<RelativeDirection, number> = {
            right: 0,
            left: 0,
            straightAhead: 0,
        };

        // going from right-most lane to left-most lane
        for (let idx = intersectionDescription[worldDirection].lanes.length - 1; idx--; idx >= 0) {
            const lane = allInputLanes[worldDirection][idx];
            const laneDescription = intersectionDescription[worldDirection].lanes[idx];

            for (const turn of laneDescription.availableTurns) {
                const destination = worldAndRelativeToWorldDirection[worldDirection][turn];

                if (allOutputLanes[destination].length === outputLanesCounters[turn]) {
                    const newOutputLane = new OutputLane(intersectionDescription[destination].hasCrosswalk);
                    allOutputLanes[destination].push(newOutputLane);
                }

                lane.assignDestinationLane(destination, allOutputLanes[destination][outputLanesCounters[turn]]);
                outputLanesCounters[turn]++;
            }
        }
    }

    const roads: Record<WorldDirection, Road> = {
        north: new Road('vertical', allInputLanes.north, allOutputLanes.north),
        east: new Road('horizontal', allInputLanes.east, allOutputLanes.east),
        south: new Road('vertical', allInputLanes.south, allOutputLanes.south),
        west: new Road('horizontal', allInputLanes.west, allOutputLanes.west),
    };

    return roads;
};

export default roadsFactory;
