import { worldDirections } from '#constants.js';
import { worldAndRelativeToWorldDirection } from '#helpers/directionConversions.js';
import InputLane from '#simulation/infrastructure/InputLane.js';
import OutputLane from '#simulation/infrastructure/OutputLane.js';
import Road from '#simulation/infrastructure/Road.js';
import { IntersectionDescription, RelativeDirection, WorldDirection } from '#simulation/types/index.js';

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
        north: new Road('north'),
        east: new Road('east'),
        south: new Road('south'),
        west: new Road('west'),
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
        for (let idx = intersectionDescription[worldDirection].lanes.length - 1; idx >= 0; idx--) {
            const lane = allInputLanes[worldDirection][idx];
            const laneDescription = intersectionDescription[worldDirection].lanes[idx];

            for (const turn of laneDescription.availableTurns) {
                const destination = worldAndRelativeToWorldDirection[worldDirection][turn];

                if (allOutputLanes[destination].length === outputLanesCounters[turn]) {
                    const newOutputLane = new OutputLane(roads[destination]);
                    allOutputLanes[destination].push(newOutputLane);
                }

                lane.assignDestinationLane(destination, allOutputLanes[destination][outputLanesCounters[turn]]);
                outputLanesCounters[turn]++;
            }
        }
    }

    roads.north.assignLanes(allInputLanes.north, allOutputLanes.north);
    roads.east.assignLanes(allInputLanes.east, allOutputLanes.east);
    roads.south.assignLanes(allInputLanes.south, allOutputLanes.south);
    roads.west.assignLanes(allInputLanes.west, allOutputLanes.west);

    return roads;
};

export default roadsFactory;
