import { create } from "zustand";
import type { WorldDirection } from "../types/index";

interface UIState {
  currentStep: number;
  selectedRoad: WorldDirection;
  hoveredLaneIndex: number | null;

  setStep: (step: number) => void;
  setSelectedRoad: (road: WorldDirection) => void;
  setHoveredLaneIndex: (index: number | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  currentStep: 1, // 1: Start, 2: Intersection, 3: Commands, 4: Simulation
  selectedRoad: "south",
  hoveredLaneIndex: null,

  setStep: (step) => set({ currentStep: step }),
  setSelectedRoad: (road) => set({ selectedRoad: road }),
  setHoveredLaneIndex: (index) => set({ hoveredLaneIndex: index }),
}));
