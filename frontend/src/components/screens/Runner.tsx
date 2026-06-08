import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  IconButton,
  Slider,
  Stack,
} from "@mui/material";
import { PlayArrow, Pause, SkipNext, SkipPrevious } from "@mui/icons-material";
import IntersectionCanvas from "../../canvas/IntersectionCanvas";
import { useUIStore } from "../../store/useUIStore";
import { useSimulationStore } from "../../store/useSimulationStore";
import { useAnimationStore } from "../../store/useAnimationStore";

export default function Screen4SimulationRunner() {
  const setStep = useUIStore((state) => state.setStep);
  const {
    simulationOutput,
    intersectionDescription,
    controllerType,
    commands,
    setSimulationOutput,
  } = useSimulationStore();
  const {
    currentSnapshotIndex,
    isPlaying,
    playbackSpeed,
    stepForward,
    stepBackward,
    togglePlay,
    setPlaybackSpeed,
  } = useAnimationStore();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleRunSimulation = async () => {
      setIsLoading(true);
      try {
        const payload = {
          intersectionDescription,
          controllerType,
          commands,
        };

        const response = await fetch("/api/simulate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }

        const data = await response.json();

        setSimulationOutput(data);
      } catch (error) {
        console.error("Failed to run simulation:", error);
        alert("Error running simulation. Check the console.");
      } finally {
        setIsLoading(false);
      }
    };

    handleRunSimulation();
  }, [commands, controllerType, intersectionDescription, setSimulationOutput]);

  const [serverLog, setServerLog] = useState<string>(
    "Initializing simulation...",
  );

  useEffect(() => {
    async function fetchSimulationResult() {
      const result = await Promise.resolve(
        "Simulation output received. Ready to play.",
      );
      setServerLog(result);
    }

    void fetchSimulationResult();
  }, []);

  const maxIndex = simulationOutput ? simulationOutput.snapshots.length - 1 : 0;
  const currentSnapshot = simulationOutput?.snapshots[currentSnapshotIndex];

  if (isLoading) return <>loading...</>;

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Grid container spacing={2} sx={{ flexGrow: 1, overflow: "hidden" }}>
        <Grid size={{ xs: 12, md: 8 }} sx={{ height: "100%" }}>
          <Paper
            elevation={3}
            sx={{
              height: "100%",
              bgcolor: "#e0e0e0",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <IntersectionCanvas
              mode="simulate"
              lightsState={currentSnapshot?.lights}
            />
            {/* overlay the <CarNode> and <PedestrianNode> elements here in the next step */}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }} sx={{ height: "100%" }}>
          <Paper
            elevation={3}
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              p: 2,
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Simulation Playback
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                mb: 2,
              }}
            >
              <IconButton
                onClick={stepBackward}
                disabled={currentSnapshotIndex === 0}
              >
                <SkipPrevious />
              </IconButton>
              <IconButton
                color="primary"
                onClick={togglePlay}
                sx={{ transform: "scale(1.5)", mx: 2 }}
              >
                {isPlaying ? <Pause /> : <PlayArrow />}
              </IconButton>
              <IconButton
                onClick={() => stepForward(maxIndex)}
                disabled={currentSnapshotIndex === maxIndex}
              >
                <SkipNext />
              </IconButton>
            </Box>

            <Stack
              spacing={2}
              direction="row"
              sx={{ mb: 2, alignItems: "center" }}
            >
              <Typography variant="body2">Speed:</Typography>
              <Slider
                value={playbackSpeed}
                min={0.5}
                max={3}
                step={0.5}
                onChange={(_, val) => setPlaybackSpeed(val as number)}
                valueLabelDisplay="auto"
              />
            </Stack>

            <Typography
              variant="caption"
              sx={{ textAlign: "center", display: "block", mb: 2 }}
            >
              Step {currentSnapshotIndex + 1} / {maxIndex + 1}
            </Typography>

            <Typography variant="subtitle2" gutterBottom>
              Server Output (Current Snapshot)
            </Typography>
            <Box
              sx={{
                flexGrow: 1,
                bgcolor: "#1e1e1e",
                color: "#4caf50",
                p: 1,
                borderRadius: 1,
                overflowY: "auto",
                fontFamily: "monospace",
                fontSize: "0.75rem",
              }}
            >
              <pre style={{ margin: 0 }}>
                {currentSnapshot
                  ? JSON.stringify(currentSnapshot, null, 2)
                  : serverLog}
              </pre>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button variant="outlined" onClick={() => setStep(3)}>
          Back to Commands
        </Button>
      </Box>
    </Box>
  );
}
