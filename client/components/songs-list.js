import React, { useContext } from 'react';
import { PlayerContext } from './player-context';

const SongsList = ({ allSongs, onSelectSong }) => {
  const { currentSong } = useContext(PlayerContext);

  const handleSelectSong = (song) => {
    onSelectSong(song);
  };

  return (
    <div className="container mx-auto px-4 py-2">
      {allSongs.map((song) => (
        <div
          key={song.id}
          className={`list-group-item d-flex justify-content-between align-items-center rounded-md hover:bg-stone-100 shadow-sm cursor-pointer py-3 px-4 mb-2 ${
            currentSong && currentSong.id === song.id
              ? 'bg-stone-100 font-bold text-orange-400'
              : ''
          }`}
          onClick={() => handleSelectSong(song)}
        >
          <div className="col">
            <h5 className="text-xl font-bold">{song.title}</h5>
            <h5 className="text-gray-500 text-sm">
              {song.artist}, {song.album}, {song.year}
            </h5>
          </div>
          <div className="col text-end">
            <h1 className="text-gray-500 text-sm">{song.duration}</h1>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SongsList;
