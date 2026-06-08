import { useEffect, useState } from "react";
import { Box, Grid, Paper, Typography, Button } from "@mui/material";
import { SkipNext, SkipPrevious } from "@mui/icons-material";
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
  const { currentSnapshotIndex, stepForward, stepBackward } =
    useAnimationStore();

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
        "Simulation output received. Ready to step.",
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
                gap: 2,
                mb: 4,
              }}
            >
              <Button
                variant="contained"
                startIcon={<SkipPrevious />}
                onClick={stepBackward}
                disabled={currentSnapshotIndex === 0}
              >
                Previous
              </Button>

              <Button
                variant="contained"
                endIcon={<SkipNext />}
                onClick={() => stepForward(maxIndex)}
                disabled={currentSnapshotIndex === maxIndex}
              >
                Next
              </Button>
            </Box>

            <Typography
              variant="h6"
              sx={{ textAlign: "center", display: "block", mb: 2 }}
            >
              Step {currentSnapshotIndex + 1} / {maxIndex + 1}
            </Typography>

            <Typography variant="subtitle2" gutterBottom>
              Server output (current snapshot)
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
