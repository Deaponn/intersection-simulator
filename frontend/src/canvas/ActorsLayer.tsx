import { useMemo } from "react";
import { Group, Rect, Circle } from "react-konva";
import type { Snapshot } from "../types/index";
import { flattenSnapshot } from "../utils/snapshotMapper";
import { CAR_LENGTH, CAR_WIDTH } from "../utils/geometry";

interface ActorsLayerProps {
  currSnapshot: Snapshot | null;
}

export default function ActorsLayer({ currSnapshot }: ActorsLayerProps) {
  const currState = useMemo(
    () =>
      currSnapshot
        ? flattenSnapshot(currSnapshot)
        : { cars: new Map(), peds: new Map() },
    [currSnapshot],
  );

  const carIds = Array.from(currState.cars.keys());
  const pedIds = Array.from(currState.peds.keys());

  return (
    <Group>
      {carIds.map((id) => {
        const car = currState.cars.get(id)!;

        return (
          <Group
            key={`car-${id}`}
            x={car.x}
            y={car.y}
            rotation={car.rotation}
          >
            <Rect
              x={-CAR_WIDTH / 2}
              y={-CAR_LENGTH / 2}
              width={CAR_WIDTH}
              height={CAR_LENGTH}
              fill="#2196f3"
              cornerRadius={4}
            />

            <Rect
              x={-CAR_WIDTH / 2 + 2}
              y={-CAR_LENGTH / 2 + 8}
              width={CAR_WIDTH - 4}
              height={10}
              fill="#111"
              cornerRadius={2}
            />

            <Circle
              x={-CAR_WIDTH / 2 + 2}
              y={-CAR_LENGTH / 2 + 2}
              radius={3}
              fill="orange"
              visible={car.isBlinking === "left"}
            />
            <Circle
              x={-CAR_WIDTH / 2 + 2}
              y={CAR_LENGTH / 2 - 2}
              radius={3}
              fill="orange"
              visible={car.isBlinking === "left"}
            />
            <Circle
              x={CAR_WIDTH / 2 - 2}
              y={-CAR_LENGTH / 2 + 2}
              radius={3}
              fill="orange"
              visible={car.isBlinking === "right"}
            />
            <Circle
              x={CAR_WIDTH / 2 - 2}
              y={CAR_LENGTH / 2 - 2}
              radius={3}
              fill="orange"
              visible={car.isBlinking === "right"}
            />
          </Group>
        );
      })}

      {pedIds.map((id) => {
        const ped = currState.peds.get(id)!;
        return (
          <Circle
            key={`ped-${id}`}
            x={ped.x}
            y={ped.y}
            radius={6}
            fill="#ff9800"
            stroke="#fff"
            strokeWidth={2}
          />
        );
      })}
    </Group>
  );
}