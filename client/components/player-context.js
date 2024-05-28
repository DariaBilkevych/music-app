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
  content: [],
  setContent: (content) => {},
});

export const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [content, setContent] = useState([]);

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
        content,
        setContent,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
