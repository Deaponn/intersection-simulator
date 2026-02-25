export type Axis = 'horizontal' | 'vertical';

export type Destination = 'East' | 'North' | 'South' | 'West';

export type Direction = 'Left' | 'Right' | 'StraightAhead';

export interface TrafficArrowsState {
    east: boolean;
    north: boolean;
    south: boolean;
    west: boolean;
}

export interface TrafficLightsState {
    arrows: TrafficArrowsState;
    greenAxis: 'none' | Axis; // during axis change the value should be 'none' (both horizontal and vertical axes have yellow light)
}
