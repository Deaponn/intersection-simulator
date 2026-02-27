import { RelativeDirection, WorldDirection } from "#simulation/types/index.js";

const worldAndRelativeToWorldDirection: Record<WorldDirection, Record<RelativeDirection, WorldDirection>> = {
    north: {
        right: 'west',
        left: 'east',
        straightAhead: 'south',
    },
    east: {
        right: 'north',
        left: 'south',
        straightAhead: 'west',
    },
    south: {
        right: 'east',
        left: 'west',
        straightAhead: 'north',
    },
    west: {
        right: 'south',
        left: 'north',
        straightAhead: 'east',
    },
};

export { worldAndRelativeToWorldDirection };
