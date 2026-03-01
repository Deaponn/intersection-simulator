import Intersection from "#simulation/infrastructure/Intersection.js";
import { TrafficArrowsState, TrafficLightsState } from "#simulation/types/index.js";

export default abstract class Controller {
    abstract step(intersection: Intersection): TrafficLightsState;

    redArrows(): TrafficArrowsState {
        return { east: false, north: false, south: false, west: false };
    }
}
