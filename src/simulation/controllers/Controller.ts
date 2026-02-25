import { TrafficArrowsState, TrafficLightsState } from "#simulation/types/index.js";

export default abstract class Controller {
    abstract step(): TrafficLightsState;

    redArrows(): TrafficArrowsState {
        return { east: false, north: false, south: false, west: false };
    }
}
