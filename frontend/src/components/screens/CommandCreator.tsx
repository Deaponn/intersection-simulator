import { useState } from "react";
import { Box, Grid, Paper, Button, CircularProgress } from "@mui/material";
import CommandControls from "../controls/CommandControls";
import IntersectionCanvas from "../../canvas/IntersectionCanvas";
import { useUIStore } from "../../store/useUIStore";
import { useSimulationStore } from "../../store/useSimulationStore";

export default function Screen3CommandCreator() {
  const setStep = useUIStore((state) => state.setStep);

  const {
    intersectionDescription,
    controllerType,
    commands,
    setSimulationOutput,
  } = useSimulationStore();

  const [isLoading, setIsLoading] = useState(false);

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

      setStep(4);
    } catch (error) {
      console.error("Failed to run simulation:", error);
      alert("Error running simulation. Check the console.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Grid container spacing={2} sx={{ flexGrow: 1, overflow: "hidden" }}>
        <Grid size={{ xs: 12, md: 5, lg: 4 }} sx={{ height: "100%" }}>
          <Paper
            elevation={3}
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <CommandControls />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 7, lg: 8 }} sx={{ height: "100%" }}>
          <Paper
            elevation={3}
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "#e0e0e0",
              overflow: "hidden",
            }}
          >
            <IntersectionCanvas mode="command" />
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button
          variant="outlined"
          onClick={() => setStep(2)}
          disabled={isLoading}
        >
          Back to Intersection
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleRunSimulation}
          disabled={isLoading || commands.length === 0}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Next: Run Simulation"
          )}
        </Button>
      </Box>
    </Box>
  );
}
