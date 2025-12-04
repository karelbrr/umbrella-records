"use client";
import { AudioDetails } from "@/app/beats/[id]/beat-details";
import { createContext, useContext, useState, ReactNode } from "react";

interface PlayerContextType {
  activeBeat: AudioDetails | null;
  isPlaying: boolean;
  playBeat: (beat: AudioDetails) => void;
  togglePlay: () => void;
  setIsPlaying: (playing: boolean) => void;
  closePlayer: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [activeBeat, setActiveBeat] = useState<AudioDetails | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playBeat = (beat: AudioDetails) => {
    setActiveBeat(beat);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };
  
  const closePlayer = () => {
      setActiveBeat(null);
      setIsPlaying(false);
  }

  return (
    <PlayerContext.Provider value={{ activeBeat, isPlaying, playBeat, togglePlay, setIsPlaying, closePlayer }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}