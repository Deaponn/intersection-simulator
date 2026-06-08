import { Box, Grid, Paper } from "@mui/material";
import CommandControls from "../controls/CommandControls";
import IntersectionCanvas from "../../canvas/IntersectionCanvas";

export default function Screen3CommandCreator() {
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
    </Box>
  );
}
