import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
  Button,
  Divider,
  Tooltip,
  Paper,
} from "@mui/material";
import { Add, Remove, ContentCopy } from "@mui/icons-material";
import { useSimulationStore } from "../../store/useSimulationStore";
import { useUIStore } from "../../store/useUIStore";
import { getDisabledTurns } from "../../utils/laneLogic";
import type { WorldDirection, RelativeDirection } from "../../types/index";
import { worldDirections } from "../../constants";

export default function IntersectionControls() {
  const { intersectionDescription, setLaneCount, setLaneTurns } =
    useSimulationStore();
  const { selectedRoad, setSelectedRoad, setHoveredLaneIndex } = useUIStore();

  const currentRoadData = intersectionDescription[selectedRoad] || {
    lanes: [],
  };
  const laneCount = currentRoadData.lanes.length;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(
      JSON.stringify(intersectionDescription, null, 2),
    );
  };

  const toggleTurn = (laneIndex: number, turn: RelativeDirection) => {
    const currentTurns = currentRoadData.lanes[laneIndex].availableTurns;
    const newTurns = currentTurns.includes(turn)
      ? currentTurns.filter((t) => t !== turn)
      : [...currentTurns, turn];

    setLaneTurns(selectedRoad, laneIndex, newTurns);
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", height: "100%", p: 2 }}
    >
      <Typography variant="h6" gutterBottom fontWeight="bold">
        Intersection Settings
      </Typography>

      <FormControl fullWidth margin="normal" size="small">
        <InputLabel>Selected Road</InputLabel>
        <Select
          value={selectedRoad}
          label="Selected Road"
          onChange={(e) => setSelectedRoad(e.target.value as WorldDirection)}
        >
          {worldDirections.map((road) => (
            <MenuItem key={road} value={road}>
              {road.toUpperCase()}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          my: 2,
          p: 1,
          bgcolor: "background.default",
          borderRadius: 1,
        }}
      >
        <Typography variant="body2" fontWeight="bold">
          Input Lanes:
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            size="small"
            onClick={() =>
              setLaneCount(selectedRoad, Math.max(1, laneCount - 1))
            }
            disabled={laneCount <= 1}
          >
            <Remove />
          </IconButton>
          <Typography sx={{ mx: 2, minWidth: "20px", textAlign: "center" }}>
            {laneCount}
          </Typography>
          <IconButton
            size="small"
            onClick={() =>
              setLaneCount(selectedRoad, Math.min(6, laneCount + 1))
            }
          >
            <Add />
          </IconButton>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        <Typography variant="subtitle2" gutterBottom>
          Lane Turn Configuration (Left to Right)
        </Typography>

        <Stack spacing={1}>
          {currentRoadData.lanes.map((lane, index) => {
            const disabledTurns = getDisabledTurns(
              currentRoadData.lanes,
              index,
            );

            return (
              <Paper
                key={index}
                variant="outlined"
                sx={{
                  p: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "background-color 0.2s",
                  "&:hover": { bgcolor: "action.hover" },
                }}
                onMouseEnter={() => setHoveredLaneIndex(index)}
                onMouseLeave={() => setHoveredLaneIndex(null)}
              >
                <Typography
                  variant="caption"
                  sx={{ width: "40px", fontWeight: "bold" }}
                >
                  Lane {index + 1}
                </Typography>

                <Stack direction="row" spacing={0}>
                  <Tooltip
                    title={
                      disabledTurns.left ? "Collides with lane to the left" : ""
                    }
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          checked={lane.availableTurns.includes("left")}
                          onChange={() => toggleTurn(index, "left")}
                          disabled={disabledTurns.left}
                        />
                      }
                      label={<Typography variant="caption">Left</Typography>}
                      sx={{ m: 0, mr: 1 }}
                    />
                  </Tooltip>
                  <Tooltip
                    title={
                      disabledTurns.straightAhead
                        ? "Collides with adjacent lane"
                        : ""
                    }
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          checked={lane.availableTurns.includes(
                            "straightAhead",
                          )}
                          onChange={() => toggleTurn(index, "straightAhead")}
                          disabled={disabledTurns.straightAhead}
                        />
                      }
                      label={
                        <Typography variant="caption">Straight</Typography>
                      }
                      sx={{ m: 0, mr: 1 }}
                    />
                  </Tooltip>
                  <Tooltip
                    title={
                      disabledTurns.right
                        ? "Collides with lane to the right"
                        : ""
                    }
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          checked={lane.availableTurns.includes("right")}
                          onChange={() => toggleTurn(index, "right")}
                          disabled={disabledTurns.right}
                        />
                      }
                      label={<Typography variant="caption">Right</Typography>}
                      sx={{ m: 0 }}
                    />
                  </Tooltip>
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ height: "150px", display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography variant="subtitle2">Intersection Description</Typography>
          <Button
            size="small"
            startIcon={<ContentCopy />}
            onClick={handleCopyJson}
          >
            Copy JSON
          </Button>
        </Box>
        <TextField
          multiline
          fullWidth
          rows={4}
          value={JSON.stringify(intersectionDescription, null, 2)}
          slotProps={{
            input: {
              readOnly: true,
              sx: { fontSize: "0.75rem", fontFamily: "monospace" },
            },
          }}
          sx={{ flexGrow: 1, overflowY: "auto" }}
        />
      </Box>
    </Box>
  );
}
