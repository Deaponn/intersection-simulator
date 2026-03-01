import { Axis, RelativeDirection, WorldDirection } from '#simulation/types/index.js';

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

type WorldWorldToRelative = {
    [Start in WorldDirection]: Record<Exclude<WorldDirection, Start>, RelativeDirection>;
};

const worldAndWorldToRelativeDirection: WorldWorldToRelative = {
    north: {
        east: 'left',
        south: 'straightAhead',
        west: 'right',
    },
    east: {
        north: 'right',
        south: 'left',
        west: 'straightAhead',
    },
    south: {
        north: 'straightAhead',
        east: 'right',
        west: 'left',
    },
    west: {
        north: 'left',
        east: 'straightAhead',
        south: 'right',
    },
};

const axisOfDirection: Record<WorldDirection, Axis> = {
    north: 'vertical',
    east: 'horizontal',
    south: 'vertical',
    west: 'horizontal',
};

const oppositeAxis: Record<Axis, Axis> = {
    horizontal: 'vertical',
    vertical: 'horizontal',
};

export { worldAndRelativeToWorldDirection, worldAndWorldToRelativeDirection, axisOfDirection, oppositeAxis };
