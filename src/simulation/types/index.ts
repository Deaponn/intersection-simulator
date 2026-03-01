import { z } from 'zod';
import { axes, relativeDirections, roadSides, worldDirections } from '#constants.js';
import { controllerTypes } from '#simulation/controllers/index.js';

const WorldDirectionSchema = z.enum(worldDirections);
export type WorldDirection = z.infer<typeof WorldDirectionSchema>;

const RelativeDirectionSchema = z.enum(relativeDirections);
export type RelativeDirection = z.infer<typeof RelativeDirectionSchema>;

const RoadSideSchema = z.enum(roadSides);
export type RoadSide = z.infer<typeof RoadSideSchema>;

const AxisSchema = z.enum(axes);
export type Axis = z.infer<typeof AxisSchema>;

const ControllerTypesSchema = z.enum(controllerTypes);
export type ControllerTypes = z.infer<typeof ControllerTypesSchema>;

const AddVehicleCommandSchema = z
    .object({
        type: z.literal('addVehicle'),
        vehicleId: z.string(),
        startRoad: WorldDirectionSchema,
        endRoad: WorldDirectionSchema,
        laneIdx: z.number().optional(),
    })
    .refine((data) => data.startRoad !== data.endRoad, {
        message: 'endRoad must be different from startRoad',
    });

const AddPedestrianCommandSchema = z.object({
    type: z.literal('addPedestrian'),
    pedestrianId: z.string(),
    roadToCross: WorldDirectionSchema,
    startSide: RoadSideSchema,
});

const CommandSchema = z.discriminatedUnion('type', [
    z.object({ type: z.literal('step') }),
    AddVehicleCommandSchema,
    AddPedestrianCommandSchema,
]);
export type Command = z.infer<typeof CommandSchema>;

const LaneDescriptionSchema = z.object({
    availableTurns: z.array(RelativeDirectionSchema),
});

const RoadDescriptionSchema = z.object({
    lanes: z.array(LaneDescriptionSchema),
});

const IntersectionDescriptionSchema = z.record(WorldDirectionSchema, RoadDescriptionSchema);
export type IntersectionDescription = z.infer<typeof IntersectionDescriptionSchema>;

export const SimulationDescriptionSchema = z.object({
    intersectionDescription: IntersectionDescriptionSchema.optional(),
    controllerType: ControllerTypesSchema.optional(),
    commands: z.array(CommandSchema),
});
export type SimulationDescription = z.infer<typeof SimulationDescriptionSchema>;

const TrafficArrowsStateSchema = z.record(WorldDirectionSchema, z.boolean());
export type TrafficArrowsState = z.infer<typeof TrafficArrowsStateSchema>;

const TrafficLightsStateSchema = z.object({
    arrows: TrafficArrowsStateSchema,
    greenAxis: z.union([z.literal('none'), AxisSchema]),
});
export type TrafficLightsState = z.infer<typeof TrafficLightsStateSchema>;

export interface StepStatus {
    leftVehicles: string[];
}

const PedestrianSchema = z.object({
    pedestrianId: z.string(),
});
export type PedestrianJson = z.infer<typeof PedestrianSchema>;

const CarSchema = z.object({
    vehicleId: z.string(),
    direction: RelativeDirectionSchema,
});
export type CarJson = z.infer<typeof CarSchema>;

const OutputLanesSchema = z.array(
    z.object({
        preCrosswalkCar: CarSchema.nullable(),
        postCrosswalkCar: CarSchema.nullable(),
    }),
);
export type OutputLanesSnapshot = z.infer<typeof OutputLanesSchema>;

const InputLanesSchema = z.array(
    z.object({
        preLightsCars: z.array(CarSchema),
        postLightsCar: CarSchema.nullable(),
    }),
);
export type InputLanesSnapshot = z.infer<typeof InputLanesSchema>;

const RoadSnapshotSchema = z.object({
    pedestrians: z.record(RoadSideSchema, z.array(PedestrianSchema)),
    inputLanes: InputLanesSchema,
    outputLanes: OutputLanesSchema,
});
export type RoadSnapshot = z.infer<typeof RoadSnapshotSchema>;

const IntersectionSnapshotSchema = z.record(WorldDirectionSchema, RoadSnapshotSchema);
export type IntersectionSnapshot = z.infer<typeof IntersectionSnapshotSchema>;

const SnapshotSchema = z.object({
    lights: TrafficLightsStateSchema,
    intersectionState: IntersectionSnapshotSchema,
    actorsLeft: z.array(z.string()),
});
export type Snapshot = z.infer<typeof SnapshotSchema>;

export const SimulationOutputSchema = z.object({
    snapshots: z.array(SnapshotSchema),
});
export type SimulationOutput = z.infer<typeof SimulationOutputSchema>;
