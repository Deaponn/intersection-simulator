import { useState, useEffect, type JSX } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  Delete,
  DirectionsCar,
  DirectionsWalk,
  TurnLeft,
  ArrowUpward,
  TurnRight,
  RotateRight,
  RotateLeft,
  AddCircleOutline,
  PlaylistAdd,
} from "@mui/icons-material";
import { useSimulationStore } from "../../store/useSimulationStore";
import { useUIStore } from "../../store/useUIStore";
import type {
  WorldDirection,
  ControllerTypes,
  RelativeDirection,
  // Command,
} from "../../types/index";
import { worldDirections } from "../../constants";
import NavBar from "./NavBar";

// Helper to calculate end road based on start road and relative turn
const calculateEndRoad = (
  start: WorldDirection,
  turn: RelativeDirection,
): WorldDirection => {
  const startIdx = worldDirections.indexOf(start);
  if (turn === "right")
    return worldDirections[(startIdx + 1) % 4] as WorldDirection;
  if (turn === "straightAhead")
    return worldDirections[(startIdx + 2) % 4] as WorldDirection;
  if (turn === "left")
    return worldDirections[(startIdx + 3) % 4] as WorldDirection;
  return "south";
};

// Theme colors to match screenshot
const themeColors = {
  bg: "#f5f3ec",
  cardBorder: "#e0dcd1",
  textMain: "#455a4d",
  textGreen: "#518263",
  buttonGreen: "#4d7c5b",
  toggleActiveBg: "#7ba586",
  toggleInactiveBg: "#fcfcfa",
};

export default function CommandControls() {
  const {
    intersectionDescription,
    controllerType,
    setControllerType,
    commands,
    addCommand,
    removeCommand,
  } = useSimulationStore();

  const { setSelectedRoad, setHoveredLaneIndex } = useUIStore();

  // New UI specific states
  const [vehicleLaneStr, setVehicleLaneStr] = useState<string>("north-0");
  const [vehicleTurn, setVehicleTurn] = useState<RelativeDirection>("left");
  const [pedRoad, setPedRoad] = useState<WorldDirection>("north");
  const [pedDirection, setPedDirection] = useState<
    "clockwise" | "counterclockwise"
  >("clockwise");

  // Keep functionality of selecting road/lane for UI feedback
  useEffect(() => {
    const [road, laneStr] = vehicleLaneStr.split("-");
    setSelectedRoad(road as WorldDirection);
    setHoveredLaneIndex(parseInt(laneStr));
  }, [vehicleLaneStr, setSelectedRoad, setHoveredLaneIndex]);

  useEffect(() => {
    if (!vehicleLaneStr) return;

    const [startRoad, laneStr] = vehicleLaneStr.split("-") as [
      WorldDirection,
      string,
    ];
    const laneIdx = parseInt(laneStr, 10);
    const availableTurns =
      intersectionDescription[startRoad]?.lanes[laneIdx]?.availableTurns || [];

    // Order of priority for "leftmost"
    const turnOrder: RelativeDirection[] = ["left", "straightAhead", "right"];
    const leftmostTurn = turnOrder.find((turn) =>
      availableTurns.includes(turn),
    );

    if (leftmostTurn) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVehicleTurn(leftmostTurn);
    }
  }, [vehicleLaneStr, intersectionDescription]);

  const handleAddVehicle = () => {
    const [startRoad, laneStr] = vehicleLaneStr.split("-") as [
      WorldDirection,
      string,
    ];
    const laneIdx = parseInt(laneStr);
    const endRoad = calculateEndRoad(startRoad, vehicleTurn);

    const vehicleCount = commands.filter((c) => c.type === "addVehicle").length;
    addCommand({
      type: "addVehicle",
      vehicleId: `vehicle${vehicleCount + 1}`,
      startRoad,
      endRoad,
      laneIdx,
    });
  };

  const handleAddPedestrian = () => {
    const pedCount = commands.filter((c) => c.type === "addPedestrian").length;
    addCommand({
      type: "addPedestrian",
      pedestrianId: `pedestrian${pedCount + 1}`,
      roadToCross: pedRoad,
      startSide: pedDirection === "clockwise" ? "left" : "right",
    });
  };

  const handleAddStep = () => {
    addCommand({ type: "step" });
  };

  const handleCopyPayload = () => {
    const payload = { intersectionDescription, controllerType, commands };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
  };

  // Generate options for "Starting Lane" dropdown
  const laneOptions = worldDirections.flatMap(
    (road) =>
      intersectionDescription[road]?.lanes.map((_, idx) => ({
        value: `${road}-${idx}`,
        label: `${road.charAt(0).toUpperCase() + road.slice(1)} Road - Lane ${idx + 1}`,
      })) || [],
  );

  const vehicleButtons: {
    value: RelativeDirection;
    label: string;
    icon: JSX.Element;
  }[] = [
    {
      value: "left",
      label: "Left",
      icon: <TurnLeft fontSize="small" />,
    },
    {
      value: "straightAhead",
      label: "Straight",
      icon: <ArrowUpward fontSize="small" />,
    },
    {
      value: "right",
      label: "Right",
      icon: <TurnRight fontSize="small" />,
    },
  ];

  const pedButtons: {
    value: "clockwise" | "counterclockwise";
    label: string;
    icon: JSX.Element;
  }[] = [
    {
      value: "clockwise",
      label: "Clockwise",
      icon: <RotateRight fontSize="small" />,
    },
    {
      value: "counterclockwise",
      label: "Counterclockwise",
      icon: <RotateLeft fontSize="small" />,
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: themeColors.bg,
        p: 2,
        overflowY: "auto",
      }}
    >
      {/* Hidden Controller Type Select (retained functionality) */}
      <Box sx={{ display: "none" }}>
        <Select
          value={controllerType || ""}
          onChange={(e) => setControllerType(e.target.value as ControllerTypes)}
        >
          <MenuItem value="simple-controller">simple-controller</MenuItem>
        </Select>
      </Box>

      {/* --- ADD VEHICLE SECTION --- */}
      <Box
        sx={{
          border: `1px solid ${themeColors.cardBorder}`,
          borderRadius: 3,
          p: 2,
          mb: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 2,
            color: themeColors.textGreen,
          }}
        >
          <DirectionsCar fontSize="small" />
          <Typography
            variant="h6"
            sx={{ fontFamily: "serif", fontSize: "1.2rem", fontWeight: 500 }}
          >
            Add Vehicle
          </Typography>
        </Box>

        <Typography
          variant="caption"
          sx={{ color: "text.secondary", display: "block", mb: 0.5 }}
        >
          Starting Lane
        </Typography>
        <Select
          fullWidth
          size="small"
          value={vehicleLaneStr}
          onChange={(e) => setVehicleLaneStr(e.target.value)}
          sx={{ mb: 2, bgcolor: themeColors.toggleInactiveBg, borderRadius: 2 }}
        >
          {laneOptions.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>

        <Typography
          variant="caption"
          sx={{ color: "text.secondary", display: "block", mb: 0.5 }}
        >
          Direction
        </Typography>
        <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
          {vehicleButtons.map((btn) => {
            // Determine if the button should be disabled based on available turns for the selected lane
            const [startRoad, laneStr] = vehicleLaneStr.split("-") as [
              WorldDirection,
              string,
            ];
            const laneIdx = parseInt(laneStr, 10);
            const availableTurns =
              intersectionDescription[startRoad]?.lanes[laneIdx]
                ?.availableTurns || [];
            const isDisabled = !availableTurns.includes(btn.value);

            return (
              <Button
                key={btn.value}
                disabled={isDisabled}
                onClick={() => setVehicleTurn(btn.value)}
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  textTransform: "none",
                  color:
                    vehicleTurn === btn.value ? "white" : themeColors.textMain,
                  bgcolor:
                    vehicleTurn === btn.value
                      ? themeColors.toggleActiveBg
                      : themeColors.toggleInactiveBg,
                  border: `1px solid ${
                    vehicleTurn === btn.value
                      ? themeColors.toggleActiveBg
                      : themeColors.cardBorder
                  }`,
                  borderRadius: 2,
                  py: 1,
                  "&:hover": {
                    bgcolor:
                      vehicleTurn === btn.value
                        ? themeColors.buttonGreen
                        : "#f0efe9",
                  },
                  // Add specific styling for the disabled state
                  "&.Mui-disabled": {
                    bgcolor: "rgba(0, 0, 0, 0.05)",
                    color: "rgba(0, 0, 0, 0.26)",
                    borderColor: "transparent",
                  },
                }}
              >
                {btn.icon}
                <Typography variant="caption" sx={{ mt: 0.5 }}>
                  {btn.label}
                </Typography>
              </Button>
            );
          })}
        </Box>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<AddCircleOutline />}
          onClick={handleAddVehicle}
          sx={{
            color: themeColors.buttonGreen,
            borderColor: themeColors.buttonGreen,
            borderRadius: 5,
            textTransform: "none",
            "&:hover": {
              borderColor: themeColors.buttonGreen,
              bgcolor: "rgba(77, 124, 91, 0.04)",
            },
          }}
        >
          Add to Sequence
        </Button>
      </Box>

      {/* --- ADD PEDESTRIAN SECTION --- */}
      <Box
        sx={{
          border: `1px solid ${themeColors.cardBorder}`,
          borderRadius: 3,
          p: 2,
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 2,
            color: themeColors.textGreen,
          }}
        >
          <DirectionsWalk fontSize="small" />
          <Typography
            variant="h6"
            sx={{ fontFamily: "serif", fontSize: "1.2rem", fontWeight: 500 }}
          >
            Add Pedestrian
          </Typography>
        </Box>

        <Typography
          variant="caption"
          sx={{ color: "text.secondary", display: "block", mb: 0.5 }}
        >
          Road Crossing
        </Typography>
        <Select
          fullWidth
          size="small"
          value={pedRoad}
          onChange={(e) => setPedRoad(e.target.value as WorldDirection)}
          sx={{ mb: 2, bgcolor: themeColors.toggleInactiveBg, borderRadius: 2 }}
        >
          {worldDirections.map((r) => (
            <MenuItem key={r} value={r}>
              {r.charAt(0).toUpperCase() + r.slice(1)} Crosswalk
            </MenuItem>
          ))}
        </Select>

        <Typography
          variant="caption"
          sx={{ color: "text.secondary", display: "block", mb: 0.5 }}
        >
          Direction
        </Typography>
        <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
          {pedButtons.map((btn) => (
            <Button
              key={btn.value}
              onClick={() => setPedDirection(btn.value)}
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                textTransform: "none",
                color:
                  pedDirection === btn.value ? "white" : themeColors.textMain,
                bgcolor:
                  pedDirection === btn.value
                    ? themeColors.toggleActiveBg
                    : themeColors.toggleInactiveBg,
                border: `1px solid ${pedDirection === btn.value ? themeColors.toggleActiveBg : themeColors.cardBorder}`,
                borderRadius: 2,
                py: 1,
                "&:hover": {
                  bgcolor:
                    pedDirection === btn.value
                      ? themeColors.buttonGreen
                      : "#f0efe9",
                },
              }}
            >
              {btn.icon}
              <Typography variant="caption" sx={{ mt: 0.5 }}>
                {btn.label}
              </Typography>
            </Button>
          ))}
        </Box>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<AddCircleOutline />}
          onClick={handleAddPedestrian}
          sx={{
            color: themeColors.buttonGreen,
            borderColor: themeColors.buttonGreen,
            borderRadius: 5,
            textTransform: "none",
            "&:hover": {
              borderColor: themeColors.buttonGreen,
              bgcolor: "rgba(77, 124, 91, 0.04)",
            },
          }}
        >
          Add to Sequence
        </Button>
      </Box>

      {/* --- ADD STEP BUTTON --- */}
      <Button
        fullWidth
        variant="contained"
        startIcon={<PlaylistAdd />}
        onClick={handleAddStep}
        sx={{
          bgcolor: themeColors.buttonGreen,
          color: "white",
          borderRadius: 5,
          py: 1.5,
          mb: 4,
          textTransform: "none",
          "&:hover": { bgcolor: "#3e6649" },
        }}
      >
        Add Step
      </Button>

      {/* --- BOTTOM ACTION BAR --- */}
      <NavBar currentStep={3} handleJsonButton={handleCopyPayload} />

      {/* Existing Command List (retained for functional parity, visually separated) */}
      <Box
        sx={{ mt: 4, pt: 2, borderTop: `1px solid ${themeColors.cardBorder}` }}
      >
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          Command Sequence ({commands.length})
        </Typography>
        <List
          dense
          sx={{
            flexGrow: 1,
            bgcolor: themeColors.toggleInactiveBg,
            borderRadius: 2,
            border: `1px solid ${themeColors.cardBorder}`,
            maxHeight: 150,
            overflowY: "auto",
          }}
        >
          {commands.length === 0 && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ p: 2, textAlign: "center" }}
            >
              No commands added.
            </Typography>
          )}
          {commands.map((cmd, i) => (
            <ListItem
              key={i}
              divider
              secondaryAction={
                <IconButton
                  edge="end"
                  size="small"
                  onClick={() => removeCommand(i)}
                >
                  <Delete fontSize="small" />
                </IconButton>
              }
            >
              <ListItemText
                primary={`${i + 1}. ${cmd.type}`}
                secondary={
                  cmd.type === "addVehicle"
                    ? `${cmd.startRoad} -> ${cmd.endRoad}`
                    : cmd.type === "addPedestrian"
                      ? `Cross ${cmd.roadToCross} (${cmd.startSide})`
                      : ""
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}
