import {
  Box,
  Typography,
  IconButton,
  Checkbox,
  FormControlLabel,
  Stack,
  Tooltip,
  Paper,
} from "@mui/material";
import {
  Add,
  Remove,
  KeyboardArrowDown,
  CheckCircle,
} from "@mui/icons-material";
import { useSimulationStore } from "../../store/useSimulationStore";
import { useUIStore } from "../../store/useUIStore";
import { getDisabledTurns } from "../../utils/laneLogic";
import type { RelativeDirection } from "../../types/index";
import { worldDirections } from "../../constants";
import NavBar from "./NavBar";

export default function IntersectionControls() {
  const { intersectionDescription, setLaneCount, setLaneTurns } =
    useSimulationStore();
  const { selectedRoad, setSelectedRoad, setHoveredLaneIndex } = useUIStore();

  const currentRoadData = intersectionDescription[selectedRoad] || {
    lanes: [],
  };

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

  // Color Palette specifically matching the screenshot design
  const themeColors = {
    bgApp: "#F5F3EB",
    bgCard: "#EFEBE1",
    bgLane: "#FAFAFA",
    textGreen: "#5D8A66",
    textGray: "#8A8A8A",
    textDark: "#4A4A4A",
    borderLight: "#E0DCD1",
    circleUnchecked: "#DCD8CF",
  };

  // Custom Checkbox Icons
  const UncheckedIcon = () => (
    <Box
      sx={{
        width: 20,
        height: 20,
        borderRadius: "50%",
        bgcolor: themeColors.circleUnchecked,
      }}
    />
  );

  const CheckedIcon = () => (
    <CheckCircle
      sx={{
        color: themeColors.textGreen,
        width: 22,
        height: 22,
        m: "-1px", // Adjusts slight size difference for centering
      }}
    />
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: themeColors.bgApp,
        p: { xs: 1, md: 2 },
        overflowY: "auto",
      }}
    >
      <Stack spacing={2.5} sx={{ flexGrow: 1, mb: 4 }}>
        {worldDirections.map((road) => {
          const isSelected = road === selectedRoad;
          const roadData = intersectionDescription[road] || { lanes: [] };
          const count = roadData.lanes.length;
          const roadTitle =
            road.charAt(0).toUpperCase() + road.slice(1) + " Road";

          // --- EXPANDED (SELECTED) ROAD CARD ---
          if (isSelected) {
            return (
              <Box
                key={road}
                sx={{
                  bgcolor: themeColors.bgCard,
                  borderRadius: 3,
                  p: 2,
                  border: `1px solid ${themeColors.borderLight}`,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ color: themeColors.textGreen, mb: 3 }}
                >
                  {roadTitle}
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: themeColors.textDark, mb: 1.5 }}
                  >
                    Total Lanes
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <IconButton
                      onClick={() =>
                        setLaneCount(selectedRoad, Math.max(1, count - 1))
                      }
                      disabled={count <= 1}
                      sx={{
                        border: `1px solid ${themeColors.borderLight}`,
                        bgcolor: "transparent",
                      }}
                    >
                      <Remove sx={{ color: themeColors.textGreen }} />
                    </IconButton>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        fontSize: "1.2rem",
                        minWidth: "20px",
                        textAlign: "center",
                      }}
                    >
                      {count}
                    </Typography>
                    <IconButton
                      onClick={() =>
                        setLaneCount(selectedRoad, Math.min(6, count + 1))
                      }
                      sx={{
                        border: `1px solid ${themeColors.borderLight}`,
                        bgcolor: "transparent",
                      }}
                    >
                      <Add sx={{ color: themeColors.textGreen }} />
                    </IconButton>
                  </Box>
                </Box>

                <Stack spacing={1.5}>
                  {roadData.lanes.map((lane, index) => {
                    const disabledTurns = getDisabledTurns(
                      roadData.lanes,
                      index,
                    );

                    return (
                      <Paper
                        key={index}
                        elevation={0}
                        sx={{
                          p: 1.5,
                          px: 2.5,
                          bgcolor: themeColors.bgLane,
                          border: `1px solid ${themeColors.borderLight}`,
                          borderRadius: 3,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                        onMouseEnter={() => setHoveredLaneIndex(index)}
                        onMouseLeave={() => setHoveredLaneIndex(null)}
                      >
                        <Typography
                          sx={{
                            color: themeColors.textDark,
                            minWidth: "60px",
                          }}
                        >
                          Lane {index + 1}
                        </Typography>

                        <Box sx={{ display: "flex", gap: { xs: 1, sm: 3 } }}>
                          <Tooltip
                            title={
                              disabledTurns.left
                                ? "Collides with lane to the left"
                                : ""
                            }
                          >
                            <FormControlLabel
                              control={
                                <Checkbox
                                  icon={<UncheckedIcon />}
                                  checkedIcon={<CheckedIcon />}
                                  checked={lane.availableTurns.includes("left")}
                                  onChange={() => toggleTurn(index, "left")}
                                  disabled={disabledTurns.left}
                                  sx={{ p: 0.5 }}
                                />
                              }
                              label={
                                <Typography
                                  sx={{
                                    color: themeColors.textDark,
                                    fontSize: "0.95rem",
                                  }}
                                >
                                  Left
                                </Typography>
                              }
                              sx={{ m: 0 }}
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
                                  icon={<UncheckedIcon />}
                                  checkedIcon={<CheckedIcon />}
                                  checked={lane.availableTurns.includes(
                                    "straightAhead",
                                  )}
                                  onChange={() =>
                                    toggleTurn(index, "straightAhead")
                                  }
                                  disabled={disabledTurns.straightAhead}
                                  sx={{ p: 0.5 }}
                                />
                              }
                              label={
                                <Typography
                                  sx={{
                                    color: themeColors.textDark,
                                    fontSize: "0.95rem",
                                  }}
                                >
                                  Straight
                                </Typography>
                              }
                              sx={{ m: 0 }}
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
                                  icon={<UncheckedIcon />}
                                  checkedIcon={<CheckedIcon />}
                                  checked={lane.availableTurns.includes(
                                    "right",
                                  )}
                                  onChange={() => toggleTurn(index, "right")}
                                  disabled={disabledTurns.right}
                                  sx={{ p: 0.5 }}
                                />
                              }
                              label={
                                <Typography
                                  sx={{
                                    color: themeColors.textDark,
                                    fontSize: "0.95rem",
                                  }}
                                >
                                  Right
                                </Typography>
                              }
                              sx={{ m: 0 }}
                            />
                          </Tooltip>
                        </Box>
                      </Paper>
                    );
                  })}
                </Stack>
              </Box>
            );
          }

          // --- COLLAPSED (UNSELECTED) ROAD CARD ---
          return (
            <Box
              key={road}
              onClick={() => setSelectedRoad(road)}
              sx={{
                bgcolor: themeColors.bgCard,
                borderRadius: 4,
                p: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                border: `1px solid ${themeColors.borderLight}`,
                "&:hover": {
                  opacity: 0.9,
                },
              }}
            >
              <Box>
                <Typography
                  variant="h6"
                  sx={{ color: themeColors.textGreen, mb: 0.5 }}
                >
                  {roadTitle}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: themeColors.textGray }}
                >
                  {count} {count === 1 ? "Lane" : "Lanes"} configured
                </Typography>
              </Box>
              <KeyboardArrowDown sx={{ color: themeColors.textGray }} />
            </Box>
          );
        })}
      </Stack>

      {/* --- BOTTOM NAVIGATION BAR --- */}
      <NavBar currentStep={2} handleJsonButton={handleCopyJson} />
    </Box>
  );
}
