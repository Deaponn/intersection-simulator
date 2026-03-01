import { Box, Grid, Paper, Button } from "@mui/material";
import IntersectionControls from "../controls/IntersectionControls";
import { useUIStore } from "../../store/useUIStore";
// import IntersectionCanvas from "../../canvas/IntersectionCanvas";

export default function IntersectionCreator() {
  const setStep = useUIStore((state) => state.setStep);

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Grid container spacing={2} sx={{ flexGrow: 1, overflow: "hidden" }}>
        <Grid size={{ xs: 12, md: 4 }} sx={{ height: "100%" }}>
          <Paper
            elevation={3}
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <IntersectionControls />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }} sx={{ height: "100%" }}>
          <Paper
            elevation={3}
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "#e0e0e0",
            }}
          >
            Canvas goes here
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button variant="outlined" onClick={() => setStep(1)}>
          Back
        </Button>
        <Button variant="contained" color="primary" onClick={() => setStep(3)}>
          Next: Add Commands
        </Button>
      </Box>
    </Box>
  );
}
