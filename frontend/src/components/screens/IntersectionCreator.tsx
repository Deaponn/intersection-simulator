import { Box, Grid, Paper } from "@mui/material";
import IntersectionControls from "../controls/IntersectionControls";
import IntersectionCanvas from "../../canvas/IntersectionCanvas";

export default function IntersectionCreator() {
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
              overflow: "hidden",
            }}
          >
            <IntersectionCanvas mode="edit" />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
