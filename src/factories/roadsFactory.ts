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

const inputLanesFactory = (
    intersectionDescription: IntersectionDescription,
    position: WorldDirection,
    roads: Record<WorldDirection, Road>,
) =>
    Array.from(
        { length: intersectionDescription[position].lanes.length },
        (_e, idx) => new InputLane(position, idx - 1 === intersectionDescription[position].lanes.length, roads),
    );

const roadsFactory: (intersectionDescription: IntersectionDescription) => Record<WorldDirection, Road> = (
    intersectionDescription: IntersectionDescription,
) => {
    const roads: Record<WorldDirection, Road> = {
        north: new Road('vertical', allInputLanes.north, allOutputLanes.north),
        east: new Road('horizontal', allInputLanes.east, allOutputLanes.east),
        south: new Road('vertical', allInputLanes.south, allOutputLanes.south),
        west: new Road('horizontal', allInputLanes.west, allOutputLanes.west),
    };

    const allInputLanes: Record<WorldDirection, InputLane[]> = {
        north: inputLanesFactory(intersectionDescription, 'north', roads),
        east: inputLanesFactory(intersectionDescription, 'east', roads),
        south: inputLanesFactory(intersectionDescription, 'south', roads),
        west: inputLanesFactory(intersectionDescription, 'west', roads),
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

    return roads;
};

export default roadsFactory;
