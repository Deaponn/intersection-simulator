import { useEffect, useRef, useMemo } from "react";
import { Layer, Group, Rect, Circle } from "react-konva";
import Konva from "konva";
import type { Snapshot } from "../types/index";
import { flattenSnapshot } from "../utils/snapshotMapper";
import { CAR_LENGTH, CAR_WIDTH } from "../utils/geometry";

interface ActorsLayerProps {
  prevSnapshot: Snapshot | null;
  currSnapshot: Snapshot | null;
  isPlaying: boolean;
  playbackSpeed: number;
  onAnimationComplete: () => void;
}

export default function ActorsLayer({
  prevSnapshot,
  currSnapshot,
  isPlaying,
  playbackSpeed,
  onAnimationComplete,
}: ActorsLayerProps) {
  const carRefs = useRef<Record<string, Konva.Group>>({});
  const pedRefs = useRef<Record<string, Konva.Circle>>({});
  const animRef = useRef<Konva.Animation | null>(null);

  const prevState = useMemo(
    () =>
      prevSnapshot
        ? flattenSnapshot(prevSnapshot)
        : { cars: new Map(), peds: new Map() },
    [prevSnapshot],
  );

  const currState = useMemo(
    () =>
      currSnapshot
        ? flattenSnapshot(currSnapshot)
        : { cars: new Map(), peds: new Map() },
    [currSnapshot],
  );

  const allCarIds = useMemo(
    () =>
      Array.from(
        new Set([
          ...prevState.cars.keys(),
          ...currState.cars.keys(),
          ...(currSnapshot?.actorsLeft || []),
        ]),
      ),
    [prevState, currState, currSnapshot],
  );

  const allPedIds = useMemo(
    () =>
      Array.from(
        new Set([
          ...prevState.peds.keys(),
          ...currState.peds.keys(),
          ...(currSnapshot?.actorsLeft || []),
        ]),
      ),
    [prevState, currState, currSnapshot],
  );

  const onCompleteRef = useRef(onAnimationComplete);
  useEffect(() => {
    onCompleteRef.current = onAnimationComplete;
  }, [onAnimationComplete]);

  useEffect(() => {
    if (!isPlaying || !prevSnapshot || !currSnapshot) return;

    const durationMs = 1000 / playbackSpeed;

    animRef.current = new Konva.Animation((frame) => {
      if (!frame) return false;

      let t = frame.time / durationMs;
      if (t >= 1) {
        t = 1;
        animRef.current?.stop();
        onCompleteRef.current();
      }
    }, carRefs.current[allCarIds[0]]?.getLayer());

    animRef.current.start();

    return () => {
      animRef.current?.stop();
    };
  }, [
    prevSnapshot,
    currSnapshot,
    isPlaying,
    playbackSpeed,
    allCarIds,
    allPedIds,
    prevState,
    currState,
  ]);

  return (
    <Layer>
      {allCarIds.map((id) => (
        <Group
          key={`car-${id}`}
          ref={(el) => {
            if (el) carRefs.current[id] = el;
          }}
          x={currState.cars.get(id)?.x || prevState.cars.get(id)?.x || -9999}
          y={currState.cars.get(id)?.y || prevState.cars.get(id)?.y || -9999}
          rotation={
            currState.cars.get(id)?.rotation ||
            prevState.cars.get(id)?.rotation ||
            0
          }
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
            name="left-blinker"
            x={-CAR_WIDTH / 2 + 2}
            y={-CAR_LENGTH / 2 + 2}
            radius={3}
            fill="orange"
            visible={false}
          />
          <Circle
            name="left-blinker"
            x={-CAR_WIDTH / 2 + 2}
            y={CAR_LENGTH / 2 - 2}
            radius={3}
            fill="orange"
            visible={false}
          />
          <Circle
            name="right-blinker"
            x={CAR_WIDTH / 2 - 2}
            y={-CAR_LENGTH / 2 + 2}
            radius={3}
            fill="orange"
            visible={false}
          />
          <Circle
            name="right-blinker"
            x={CAR_WIDTH / 2 - 2}
            y={CAR_LENGTH / 2 - 2}
            radius={3}
            fill="orange"
            visible={false}
          />
        </Group>
      ))}

      {allPedIds.map((id) => (
        <Circle
          key={`ped-${id}`}
          ref={(el) => {
            if (el) pedRefs.current[id] = el;
          }}
          x={currState.peds.get(id)?.x || prevState.peds.get(id)?.x || -9999}
          y={currState.peds.get(id)?.y || prevState.peds.get(id)?.y || -9999}
          radius={6}
          fill="#ff9800"
          stroke="#fff"
          strokeWidth={2}
        />
      ))}
    </Layer>
  );
}
