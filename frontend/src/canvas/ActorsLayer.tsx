import { useEffect, useRef, useMemo } from "react";
import { Group, Rect, Circle } from "react-konva";
import Konva from "konva";
import type { Snapshot } from "../types/index";
import { flattenSnapshot, type CarRenderState, type PedRenderState } from "../utils/snapshotMapper";
import { CAR_LENGTH, CAR_WIDTH } from "../utils/geometry";
import { getCarFrame, lerp } from "../utils/animationHelpers";

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
  const rootGroupRef = useRef<Konva.Group>(null);
  const carRefs = useRef<Record<string, Konva.Group>>({});
  const pedRefs = useRef<Record<string, Konva.Circle>>({});
  const animRef = useRef<Konva.Animation | null>(null);

  const prevState = useMemo(
    () =>
      prevSnapshot
        ? flattenSnapshot(prevSnapshot)
        : { cars: new Map<string, CarRenderState>(), peds: new Map<string, PedRenderState>() },
    [prevSnapshot],
  );

  const currState = useMemo(
    () =>
      currSnapshot
        ? flattenSnapshot(currSnapshot)
        : { cars: new Map<string, CarRenderState>(), peds: new Map<string, PedRenderState>() },
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

      // --- THIS IS THE RESTORED LOGIC ---

      // Animate Cars
      allCarIds.forEach((id) => {
        const node = carRefs.current[id];
        if (!node) return;

        const start = prevState.cars.get(id);
        let end = currState.cars.get(id);

        // Handle actors leaving the intersection
        if (currSnapshot.actorsLeft.includes(id) && start) {
          const rad = (start.rotation - 90) * (Math.PI / 180);
          end = {
            ...start,
            x: start.x + Math.cos(rad) * 400,
            y: start.y + Math.sin(rad) * 400,
            isBlinking: "none",
          };
        }

        if (start && end) {
          const frameState = getCarFrame(start, end, t);
          node.x(frameState.x);
          node.y(frameState.y);
          node.rotation(frameState.rotation);

          // Handle Blinker toggling
          const isBlinkerOn = Math.floor(frame.time / 300) % 2 === 0;
          const leftBlinker = node.findOne(".left-blinker");
          const rightBlinker = node.findOne(".right-blinker");

          if (leftBlinker)
            leftBlinker.visible(
              frameState.isBlinking === "left" && isBlinkerOn,
            );
          if (rightBlinker)
            rightBlinker.visible(
              frameState.isBlinking === "right" && isBlinkerOn,
            );
        } else if (end) {
          node.x(end.x);
          node.y(end.y);
          node.rotation(end.rotation);
        }
      });

      // Animate Pedestrians
      allPedIds.forEach((id) => {
        const node = pedRefs.current[id];
        if (!node) return;

        const start = prevState.peds.get(id);
        let end = currState.peds.get(id);

        if (currSnapshot.actorsLeft.includes(id) && start) {
          end = { id, x: start.x * 1.5, y: start.y * 1.5 };
        }

        if (start && end) {
          node.x(lerp(start.x, end.x, t));
          node.y(lerp(start.y, end.y, t));
        } else if (end) {
          node.x(end.x);
          node.y(end.y);
        }
      });
      // --- END OF RESTORED LOGIC ---
    }, rootGroupRef.current?.getLayer());

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
    <Group ref={rootGroupRef}>
      {allCarIds.map((id) => {
        const startX = isPlaying
          ? (prevState.cars.get(id)?.x ?? currState.cars.get(id)?.x)
          : currState.cars.get(id)?.x;
        const startY = isPlaying
          ? (prevState.cars.get(id)?.y ?? currState.cars.get(id)?.y)
          : currState.cars.get(id)?.y;
        const startRot = isPlaying
          ? (prevState.cars.get(id)?.rotation ??
            currState.cars.get(id)?.rotation)
          : currState.cars.get(id)?.rotation;

        return (
          <Group
            key={`car-${id}`}
            ref={(el) => {
              if (el) carRefs.current[id] = el;
            }}
            x={startX ?? -9999}
            y={startY ?? -9999}
            rotation={startRot ?? 0}
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
        );
      })}
      {allPedIds.map((id) => {
        const startX = isPlaying
          ? (prevState.peds.get(id)?.x ?? currState.peds.get(id)?.x)
          : currState.peds.get(id)?.x;
        const startY = isPlaying
          ? (prevState.peds.get(id)?.y ?? currState.peds.get(id)?.y)
          : currState.peds.get(id)?.y;

        return (
          <Circle
            key={`ped-${id}`}
            ref={(el) => {
              if (el) pedRefs.current[id] = el;
            }}
            x={startX ?? -9999}
            y={startY ?? -9999}
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
