import React, { useState } from 'react';

export const PlayerContext = React.createContext({
  currentSong: null,
  setCurrentSong: (song) => {},
  isPlaying: false,
  setIsPlaying: (isPlaying) => {},
  currentTime: 0,
  setCurrentTime: (currentTime) => {},
  volume: 0.5,
  setVolume: (volume) => {},
});

export const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [contentSource, setContentSource] = useState(null);

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        setCurrentSong,
        isPlaying,
        setIsPlaying,
        currentTime,
        setCurrentTime,
        volume,
        setVolume,
        contentSource,
        setContentSource,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
