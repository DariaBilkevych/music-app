import React, { useState } from 'react';

export const PlayerContext = React.createContext({
  currentSong: null,
  setCurrentSong: (song) => {},
});

export const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);

  return (
    <PlayerContext.Provider value={{ currentSong, setCurrentSong }}>
      {children}
    </PlayerContext.Provider>
  );
};
