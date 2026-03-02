import { Box, Stepper, Step, StepLabel, Container, Paper } from "@mui/material";
import { useUIStore } from "./store/useUIStore";

import StartScreen from "./components/screens/Start";
import IntersectionCreator from "./components/screens/IntersectionCreator";
import CommandCreator from "./components/screens/CommandCreator";
import Runner from "./components/screens/Runner";

const steps = [
  "Choose Preset",
  "Design Intersection",
  "Configure Commands",
  "Run Simulation",
];

export default function App() {
  const currentStep = useUIStore((state) => state.currentStep);

  const renderScreen = () => {
    switch (currentStep) {
      case 1:
        return <StartScreen />;
      case 2:
        return <IntersectionCreator />;
      case 3:
        return <CommandCreator />;
      case 4:
        return <Runner />;
      default:
        return <StartScreen />;
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#f5f5f5",
      }}
    >
      <Paper elevation={2} sx={{ p: 3, mb: 2, borderRadius: 0 }}>
        <Container maxWidth="lg">
          <Stepper activeStep={currentStep - 1} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Container>
      </Paper>

      <Box sx={{ flexGrow: 1, overflow: "hidden", p: 2 }}>{renderScreen()}</Box>
    </Box>
  );
}
