import { useRef, useEffect, useState } from "react";
import { Stage, Layer, Group, Rect, Line, Arrow, Circle } from "react-konva";
import { useSimulationStore } from "../store/useSimulationStore";
import { useUIStore } from "../store/useUIStore";
import type {
  WorldDirection,
  RelativeDirection,
  TrafficLightsState,
  LaneDescription,
} from "../types/index";
import {
  LANE_WIDTH,
  CROSSWALK_DEPTH,
  PRE_CROSSWALK_GAP,
  calculateOutputLanes,
  directionAngles,
} from "../utils/geometry";
import ActorsLayer from "./ActorsLayer";
import { useAnimationStore } from "../store/useAnimationStore";
import { worldDirections } from "../constants";

interface CanvasProps {
  mode: "edit" | "command" | "simulate";
  lightsState?: TrafficLightsState;
}

export default function IntersectionCanvas({ mode, lightsState }: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 800 });

  const intersectionDescription = useSimulationStore(
    (state) => state.intersectionDescription,
  );
  const simulationOutput = useSimulationStore(
    (state) => state.simulationOutput,
  );
  const { selectedRoad, hoveredLaneIndex } = useUIStore();
  const {
    currentSnapshotIndex,
    isPlaying,
    playbackSpeed,
    stepForward,
    togglePlay,
  } = useAnimationStore();

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const INTERSECTION_RADIUS = 200;

  const activeLights = lightsState || {
    arrows: { north: false, east: false, south: false, west: false },
    greenAxis: "none",
  };

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      <Stage width={dimensions.width} height={dimensions.height}>
        <Layer>
          <Group x={dimensions.width / 2} y={dimensions.height / 2}>
            {worldDirections.map((dir) => {
              const isSelected = mode === "edit" && selectedRoad === dir;
              const inputLanes = intersectionDescription[dir].lanes;
              const outputLaneCount = calculateOutputLanes(
                intersectionDescription,
                dir,
              );

              return (
                <RoadBranch
                  key={dir}
                  direction={dir}
                  inputLanes={inputLanes}
                  outputLaneCount={outputLaneCount}
                  isSelected={isSelected}
                  hoveredLaneIndex={
                    mode === "edit" && isSelected ? hoveredLaneIndex : null
                  }
                  intersectionRadius={INTERSECTION_RADIUS}
                  lightsState={activeLights}
                />
              );
            })}
            <Rect
              x={-INTERSECTION_RADIUS}
              y={-INTERSECTION_RADIUS}
              width={INTERSECTION_RADIUS * 2}
              height={INTERSECTION_RADIUS * 2}
              fill="#d3d3d3"
              opacity={0.3}
            />
          </Group>
        </Layer>
        {mode === "simulate" && (
          <Layer>
            <Group x={dimensions.width / 2} y={dimensions.height / 2}>
              <ActorsLayer
                prevSnapshot={
                  currentSnapshotIndex > 0
                    ? simulationOutput?.snapshots[currentSnapshotIndex - 1] ||
                      null
                    : null
                }
                currSnapshot={
                  simulationOutput?.snapshots[currentSnapshotIndex] || null
                }
                isPlaying={isPlaying}
                playbackSpeed={playbackSpeed}
                onAnimationComplete={() => {
                  const maxIndex =
                    (simulationOutput?.snapshots.length || 1) - 1;
                  if (
                    useAnimationStore.getState().currentSnapshotIndex < maxIndex
                  ) {
                    stepForward(maxIndex);
                  } else {
                    togglePlay();
                  }
                }}
              />
            </Group>
          </Layer>
        )}
      </Stage>
    </div>
  );
}

interface RoadBranchProps {
  direction: WorldDirection;
  inputLanes: LaneDescription[];
  outputLaneCount: number;
  isSelected: boolean;
  hoveredLaneIndex: number | null;
  intersectionRadius: number;
  lightsState: TrafficLightsState;
}

function RoadBranch({
  direction,
  inputLanes,
  outputLaneCount,
  isSelected,
  hoveredLaneIndex,
  intersectionRadius,
  lightsState,
}: RoadBranchProps) {
  const angle = directionAngles[direction];

  const totalInputWidth = inputLanes.length * LANE_WIDTH;
  const totalOutputWidth = outputLaneCount * LANE_WIDTH;

  const startY = -intersectionRadius;
  const roadLength = 500;
  const stopLineY = startY - CROSSWALK_DEPTH - PRE_CROSSWALK_GAP;

  const isVertical = direction === "north" || direction === "south";
  const axisMatch =
    (isVertical && lightsState.greenAxis === "vertical") ||
    (!isVertical && lightsState.greenAxis === "horizontal");
  const mainLightColor = axisMatch ? "#00ff00" : "#ff0000";
  const rightArrowActive = lightsState.arrows[direction];

  return (
    <Group rotation={angle}>
      <Rect
        x={-totalInputWidth}
        y={startY - roadLength}
        width={totalInputWidth}
        height={roadLength}
        fill={isSelected ? "#c8e6c9" : "#e0e0e0"}
        stroke="#9e9e9e"
      />
      <Rect
        x={0}
        y={startY - roadLength}
        width={totalOutputWidth}
        height={roadLength}
        fill="#ececec"
        stroke="#9e9e9e"
      />

      <ZebraCrosswalk
        startX={-totalInputWidth}
        y={startY - CROSSWALK_DEPTH}
        totalWidth={totalInputWidth + totalOutputWidth}
        depth={CROSSWALK_DEPTH}
      />

      <Line
        points={[-totalInputWidth, stopLineY, 0, stopLineY]}
        stroke="red"
        strokeWidth={4}
      />

      <Line
        points={[0, startY, 0, startY - roadLength]}
        stroke="#ffcc00"
        strokeWidth={2}
      />
      <Line
        points={[-2, startY, -2, startY - roadLength]}
        stroke="#ffcc00"
        strokeWidth={2}
      />

      {inputLanes.map((lane, idx) => {
        const laneX = -(idx + 1) * LANE_WIDTH;
        const isHovered = hoveredLaneIndex === idx;
        const isRightmost = idx === inputLanes.length - 1;

        return (
          <Group key={`in-${idx}`} x={laneX}>
            {idx > 0 && (
              <Line
                points={[LANE_WIDTH, startY, LANE_WIDTH, startY - roadLength]}
                stroke="white"
                strokeWidth={2}
                dash={[10, 15]}
              />
            )}

            {isHovered && (
              <Rect
                x={0}
                y={startY - roadLength}
                width={LANE_WIDTH}
                height={roadLength}
                fill="yellow"
                opacity={0.4}
              />
            )}

            <LaneArrows turns={lane.availableTurns} yPos={stopLineY - 60} />

            <TrafficLightNode
              x={LANE_WIDTH / 2}
              y={stopLineY - 15}
              color={mainLightColor}
              showRightArrowBox={
                isRightmost && lane.availableTurns.includes("right")
              }
              arrowActive={rightArrowActive}
            />
          </Group>
        );
      })}
    </Group>
  );
}

function TrafficLightNode({
  x,
  y,
  color,
  showRightArrowBox,
  arrowActive,
}: {
  x: number;
  y: number;
  color: string;
  showRightArrowBox: boolean;
  arrowActive: boolean;
}) {
  return (
    <Group x={x} y={y}>
      <Rect x={-8} y={-8} width={16} height={16} fill="#333" cornerRadius={3} />
      <Circle
        x={0}
        y={0}
        radius={5}
        fill={color}
        shadowColor={color}
        shadowBlur={5}
      />
      {showRightArrowBox && (
        <Group x={-20} y={0}>
          <Rect
            x={-6}
            y={-6}
            width={12}
            height={12}
            fill="#333"
            cornerRadius={2}
          />
          {arrowActive ? (
            <Arrow
              points={[3, 0, -3, 0]}
              pointerLength={3}
              pointerWidth={4}
              fill="#00ff00"
              stroke="#00ff00"
              strokeWidth={1}
              shadowColor="#00ff00"
              shadowBlur={4}
            />
          ) : (
            <Circle x={0} y={0} radius={3} fill="#550000" />
          )}
        </Group>
      )}
    </Group>
  );
}

function ZebraCrosswalk({
  startX,
  y,
  totalWidth,
  depth,
}: {
  startX: number;
  y: number;
  totalWidth: number;
  depth: number;
}) {
  const stripeWidth = 8;
  const stripeGap = 12;
  const step = stripeWidth + stripeGap;

  const stripesCount = Math.floor(totalWidth / step);

  const actualWidth = stripesCount * step - stripeGap;
  const offsetX = startX + (totalWidth - actualWidth) / 2;

  const stripes = [];
  for (let i = 0; i < stripesCount; i++) {
    stripes.push(
      <Rect
        key={`stripe-${i}`}
        x={offsetX + i * step}
        y={y}
        width={stripeWidth}
        height={depth}
        fill="#ffffff"
      />,
    );
  }

  return <Group>{stripes}</Group>;
}

function LaneArrows({
  turns,
  yPos,
}: {
  turns: RelativeDirection[];
  yPos: number;
}) {
  const centerX = LANE_WIDTH / 2;
  return (
    <Group x={centerX} y={yPos}>
      {turns.includes("straightAhead") && (
        <Arrow
          points={[0, -20, 0, 20]}
          pointerLength={10}
          pointerWidth={10}
          fill="white"
          stroke="white"
          strokeWidth={2}
        />
      )}
      {turns.includes("left") && (
        <Arrow
          points={[0, -20, 0, 0, 15, 0]}
          pointerLength={10}
          pointerWidth={10}
          fill="white"
          stroke="white"
          strokeWidth={2}
        />
      )}
      {turns.includes("right") && (
        <Arrow
          points={[0, -20, 0, 0, -15, 0]}
          pointerLength={10}
          pointerWidth={10}
          fill="white"
          stroke="white"
          strokeWidth={2}
        />
      )}
    </Group>
  );
}
