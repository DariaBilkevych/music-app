import React, { useContext } from 'react';
import { PlayerContext } from './context';

const SongsList = ({ allSongs, onSelectSong }) => {
  const { currentSong } = useContext(PlayerContext);

  const handleSelectSong = (song) => {
    onSelectSong(song);
  };

  return (
    <div className="row">
      {allSongs.map((song) => (
        <div
          key={song.id}
          className={`row currently-playing ${
            currentSong && currentSong.id === song.id
              ? 'shadow rounded text-active font-semibold border-active border-2'
              : ''
          }`}
          onClick={() => handleSelectSong(song)}
        >
          <div className="col-lg-12 d-flex justify-content-between align-items-center px-0">
            <div className="col">
              <h5 className="display-4">{song.title}</h5>
              <h5 className="lead">
                {song.artist}, {song.album}, {song.year}
              </h5>
            </div>
            <div className="col text-end">
              <h1 className="lead">{song.duration}</h1>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SongsList;
