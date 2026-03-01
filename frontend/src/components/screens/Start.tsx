import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  Container,
} from "@mui/material";
import { AddBox, Traffic } from "@mui/icons-material";
import { useUIStore } from "../../store/useUIStore";
import { useSimulationStore } from "../../store/useSimulationStore";
import { PRESETS } from "../../presets/intersection";

export default function StartScreen() {
  const setStep = useUIStore((state) => state.setStep);
  const setIntersectionPreset = useSimulationStore(
    (state) => state.setIntersectionPreset,
  );

  const handleCreateCustom = () => {
    setStep(2);
  };

  const handleSelectPreset = (presetKey: string) => {
    const preset = PRESETS[presetKey].data;
    setIntersectionPreset(preset);
    setStep(3);
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Box textAlign="center" mb={6}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Intersection Simulator
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Select a starting point for your traffic simulation.
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardActionArea
              onClick={handleCreateCustom}
              sx={{ height: "100%", p: 4, textAlign: "center" }}
            >
              <AddBox sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Custom Intersection
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Build your own intersection from scratch. Configure lanes,
                  turn restrictions, and road setups manually.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        {Object.entries(PRESETS).map(([key, preset]) => (
          <Grid size={{ xs: 12, sm: 6 }}>
            <Card elevation={3} sx={{ height: "100%" }}>
              <CardActionArea
                onClick={() => handleSelectPreset(key)}
                sx={{ height: "100%", p: 4, textAlign: "center" }}
              >
                <Traffic sx={{ fontSize: 60, color: "success.main", mb: 2 }} />
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {preset.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {preset.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
