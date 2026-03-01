import { create } from "zustand";

interface AnimationState {
  isPlaying: boolean;
  currentSnapshotIndex: number;
  playbackSpeed: number;

  togglePlay: () => void;
  setSnapshotIndex: (index: number) => void;
  setPlaybackSpeed: (speed: number) => void;
  stepForward: (maxIndex: number) => void;
  stepBackward: () => void;
}

export const useAnimationStore = create<AnimationState>((set) => ({
  isPlaying: false,
  currentSnapshotIndex: 0,
  playbackSpeed: 1,

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setSnapshotIndex: (index) => set({ currentSnapshotIndex: index }),
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),

  stepForward: (maxIndex) =>
    set((state) => ({
      currentSnapshotIndex: Math.min(state.currentSnapshotIndex + 1, maxIndex),
    })),
  stepBackward: () =>
    set((state) => ({
      currentSnapshotIndex: Math.max(state.currentSnapshotIndex - 1, 0),
    })),
}));
