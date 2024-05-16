import React, { useContext, useState, useEffect } from 'react';
import { PlayerContext } from './player-context';
import PlaylistListModal from './playlist-list-modal';
import axios from 'axios';
import { useRouter } from 'next/router';

const SongsList = ({ allSongs, onSelectSong, onDeleteSong, isEditing }) => {
  const { currentSong } = useContext(PlayerContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [playlists, setPlaylists] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get('/api/playlists');
        setPlaylists(response.data);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
    };

    fetchPlaylists();
  }, []);

  const handleSelectSong = (song) => {
    onSelectSong(song);
  };

  const handleAddToPlaylistClick = (song) => {
    setSelectedSong(song);
    setIsModalOpen(true);
  };

  const handleAddSongToPlaylist = async (playlist) => {
    try {
      const response = await axios.post(
        `/api/playlists/${playlist.id}/add-audio`,
        { audioFileId: selectedSong.id }
      );
      const newPlaylist = response.data;
      router.push(`/playlists/${newPlaylist.id}`);
    } catch (error) {
      console.error('Error adding song to playlist:', error);
    }
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
          {isEditing && (
            <button
              className={`flex items-center px-2 py-1 border border-orange-400 rounded-full text-orange-400 hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-300 mr-4`}
              onClick={() => onDeleteSong(song.id)}
            >
              <i className="ri-subtract-line text-orange-400 font-bold"></i>
            </button>
          )}
          <div className="col">
            <h5 className="text-xl font-bold">{song.title}</h5>
            <h5 className="text-gray-500 text-sm">
              {song.artist}, {song.album}, {song.year}
            </h5>
          </div>
          <div className="col text-end">
            <h1 className="text-gray-500 text-sm">{song.duration}</h1>
          </div>
          <button
            className={`flex items-center px-2 py-1 border border-orange-400 rounded-full text-orange-400 hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-300 ml-4`}
            title="Додати до плейлисту"
            onClick={() => handleAddToPlaylistClick(song)}
          >
            <i className="ri-add-line text-orange-400 font-bold"></i>
          </button>
        </div>
      ))}
      <PlaylistListModal
        playlists={playlists}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddSongToPlaylist={handleAddSongToPlaylist}
      />
    </div>
  );
};

export default SongsList;
