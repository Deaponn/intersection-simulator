import ArrowBack from "@mui/icons-material/ArrowBack";
import Check from "@mui/icons-material/Check";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { useUIStore } from "../../store/useUIStore";

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

interface INavBar {
  currentStep: number;
  handleJsonButton: () => void;
}

export default function NavBar({ currentStep, handleJsonButton }: INavBar) {
  const setStep = useUIStore((store) => store.setStep);

  return (
    <Box>
      <Divider sx={{ borderColor: themeColors.borderLight, mb: 3 }} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          startIcon={<ArrowBack />}
          sx={{
            color: themeColors.textDark,
            textTransform: "none",
            fontSize: "1rem",
          }}
          onClick={() => setStep(currentStep - 1)}
        >
          Back
        </Button>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            onClick={handleJsonButton} // Maintaining functionality via mapped button
            sx={{
              color: themeColors.textGreen,
              border: `1px solid ${themeColors.borderLight}`,
              bgcolor: themeColors.bgCard,
              borderRadius: 6,
              textTransform: "none",
              px: 3,
              "&:hover": {
                bgcolor: themeColors.borderLight,
              },
            }}
          >
            {"{ }"} Download JSON
          </Button>
          <Button
            endIcon={<Check />}
            variant="contained"
            sx={{
              bgcolor: themeColors.textGreen,
              "&:hover": { bgcolor: "#4A7052" }, // Slightly darker on hover
              borderRadius: 6,
              textTransform: "none",
              px: 4,
              boxShadow: "none",
              fontSize: "1rem",
            }}
            onClick={() => setStep(currentStep + 1)}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
