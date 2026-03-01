import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Delete, ContentCopy, Add } from "@mui/icons-material";
import { useSimulationStore } from "../../store/useSimulationStore";
import { useUIStore } from "../../store/useUIStore";
import { getTurnDirection } from "../../utils/laneLogic";
import type {
  WorldDirection,
  ControllerTypes,
  Command,
  RoadSide,
} from "../../types/index";
import { worldDirections } from "../../constants";

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

  const [availableControllers, setAvailableControllers] = useState<
    ControllerTypes[]
  >([]);

  const [draftType, setDraftType] = useState<Command["type"]>("addVehicle");
  const [draftStartRoad, setDraftStartRoad] = useState<WorldDirection>("north");
  const [draftEndRoad, setDraftEndRoad] = useState<WorldDirection>("south");
  const [draftSide, setDraftSide] = useState<RoadSide>("right");
  const [draftLaneIdx, setDraftLaneIdx] = useState<number | "">("");
  const [draftId, setDraftId] = useState<string>("");

  useEffect(() => {
    setSelectedRoad(draftStartRoad);
    setHoveredLaneIndex(draftLaneIdx !== "" ? draftLaneIdx : null);
  }, [draftStartRoad, draftLaneIdx, setSelectedRoad, setHoveredLaneIndex]);

  useEffect(() => {
    setTimeout(() => {
      setAvailableControllers(["simple-controller"] as ControllerTypes[]);
    }, 500);
  }, []);

  const getValidLanes = () => {
    const turn = getTurnDirection(draftStartRoad, draftEndRoad);
    if (!turn) return [];

    return intersectionDescription[draftStartRoad].lanes
      .map((lane, index) => ({ lane, index }))
      .filter(({ lane }) => lane.availableTurns.includes(turn));
  };

  const validLanes = draftType === "addVehicle" ? getValidLanes() : [];

  const handleAddCommand = () => {
    let newCmd: Command;

    if (draftType === "step") {
      newCmd = { type: "step" };
    } else if (draftType === "addVehicle") {
      const vehicleCount = commands.filter(
        (c) => c.type === "addVehicle",
      ).length;
      newCmd = {
        type: "addVehicle",
        vehicleId: draftId || `vehicle${vehicleCount + 1}`,
        startRoad: draftStartRoad,
        endRoad: draftEndRoad,
        laneIdx: draftLaneIdx !== "" ? draftLaneIdx : undefined,
      };
    } else {
      const pedCount = commands.filter(
        (c) => c.type === "addPedestrian",
      ).length;
      newCmd = {
        type: "addPedestrian",
        pedestrianId: draftId || `pedestrian${pedCount + 1}`,
        roadToCross: draftStartRoad,
        startSide: draftSide,
      };
    }

    addCommand(newCmd);
    setDraftId("");
  };

  const handleCopyPayload = () => {
    const payload = { intersectionDescription, controllerType, commands };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", height: "100%", p: 2 }}
    >
      <Typography variant="h6" gutterBottom fontWeight="bold">
        Simulation Configuration
      </Typography>

      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>Controller Type</InputLabel>
        <Select
          value={controllerType || ""}
          label="Controller Type"
          onChange={(e) => setControllerType(e.target.value as ControllerTypes)}
        >
          {availableControllers.map((ctrl) => (
            <MenuItem key={ctrl} value={ctrl}>
              {ctrl}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Divider sx={{ mb: 2 }} />

      <Typography variant="subtitle2" gutterBottom>
        Add Command
      </Typography>
      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>Command Type</InputLabel>
        <Select
          value={draftType}
          label="Command Type"
          onChange={(e) => setDraftType(e.target.value as Command["type"])}
        >
          <MenuItem value="step">step</MenuItem>
          <MenuItem value="addVehicle">addVehicle</MenuItem>
          <MenuItem value="addPedestrian">addPedestrian</MenuItem>
        </Select>
      </FormControl>

      {draftType !== "step" && (
        <TextField
          fullWidth
          size="small"
          sx={{ mb: 2 }}
          label={
            draftType === "addVehicle"
              ? "Vehicle ID (Optional)"
              : "Pedestrian ID (Optional)"
          }
          value={draftId}
          onChange={(e) => setDraftId(e.target.value)}
          placeholder={`Leave blank for auto-generation`}
        />
      )}

      {draftType === "addVehicle" && (
        <>
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Start Road</InputLabel>
              <Select
                value={draftStartRoad}
                label="Start Road"
                onChange={(e) =>
                  setDraftStartRoad(e.target.value as WorldDirection)
                }
              >
                {worldDirections.map((r) => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel>Destination</InputLabel>
              <Select
                value={draftEndRoad}
                label="Destination"
                onChange={(e) =>
                  setDraftEndRoad(e.target.value as WorldDirection)
                }
              >
                {worldDirections.filter((r) => r !== draftStartRoad).map((r) => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Specific Lane (Optional)</InputLabel>
            <Select
              value={draftLaneIdx}
              label="Specific Lane (Optional)"
              onChange={(e) => setDraftLaneIdx(e.target.value as number | "")}
            >
              <MenuItem value="">
                <em>Any Sufficient Lane</em>
              </MenuItem>
              {validLanes.map(({ index }) => (
                <MenuItem key={index} value={index}>
                  Lane {index + 1}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {validLanes.length === 0 && (
            <Typography
              variant="caption"
              color="error"
              sx={{ display: "block", mb: 2, mt: -1 }}
            >
              No lane supports this turn! Modify intersection or change route.
            </Typography>
          )}
        </>
      )}

      {draftType === "addPedestrian" && (
        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Road to Cross</InputLabel>
            <Select
              value={draftStartRoad}
              label="Road to Cross"
              onChange={(e) =>
                setDraftStartRoad(e.target.value as WorldDirection)
              }
            >
              {worldDirections.map((r) => (
                <MenuItem key={r} value={r}>
                  {r}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Start Side</InputLabel>
            <Select
              value={draftSide}
              label="Start Side"
              onChange={(e) => setDraftSide(e.target.value as "left" | "right")}
            >
              <MenuItem value="left">Left (Clockwise)</MenuItem>
              <MenuItem value="right">Right (Counterclockwise)</MenuItem>
            </Select>
          </FormControl>
        </Box>
      )}

      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={handleAddCommand}
        disabled={draftType === "addVehicle" && validLanes.length === 0}
      >
        Add Command
      </Button>

      <Divider sx={{ my: 2 }} />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography variant="subtitle2">
          Command List ({commands.length})
        </Typography>
        <Button
          size="small"
          startIcon={<ContentCopy />}
          onClick={handleCopyPayload}
        >
          Copy Payload
        </Button>
      </Box>

      <List
        dense
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          bgcolor: "background.paper",
          borderRadius: 1,
          border: "1px solid #ddd",
        }}
      >
        {commands.length === 0 && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ p: 2, textAlign: "center" }}
          >
            No commands added yet.
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
                    ? `Cross ${cmd.roadToCross} from ${cmd.startSide}`
                    : ""
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
