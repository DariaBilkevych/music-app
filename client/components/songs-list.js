import React, { useContext, useState, useEffect } from 'react';
import { PlayerContext } from './player-context';
import AddToPlaylistModal from './add-to-playlist-modal';
import axios from 'axios';
import { useRouter } from 'next/router';

const SongsList = ({
  allSongs,
  onSelectSong,
  onDeleteSong,
  isEditing,
  currentUser,
  noSongsMessage,
}) => {
  const { currentSong } = useContext(PlayerContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylists, setSelectedPlaylists] = useState({});

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

  const handleUpdateSongInPlaylists = async () => {
    try {
      const selectedPlaylistIds = Object.keys(selectedPlaylists);
      const addPromises = [];
      const removePromises = [];

      selectedPlaylistIds.forEach((playlistId) => {
        if (selectedPlaylists[playlistId]) {
          const playlistContainsSong = playlists
            .find((playlist) => playlist.id === playlistId)
            ?.audioFiles.some((file) => file.id === selectedSong.id);

          if (!playlistContainsSong) {
            addPromises.push(
              axios.post(`/api/playlists/${playlistId}/add-audio`, {
                audioFileId: selectedSong.id,
              })
            );
          }
        } else {
          removePromises.push(
            axios.delete(`/api/playlists/${playlistId}/${selectedSong.id}`)
          );
        }
      });

      await Promise.all([...addPromises, ...removePromises]);
      router.push(`/playlists/all`);
    } catch (error) {
      console.error('Error updating song in playlists:', error);
    }
  };

  const handlePlaylistInteraction = (song, event) => {
    event.stopPropagation();
    setSelectedSong(song);
    setIsModalOpen(true);
    const initialSelectedPlaylists = playlists.reduce((acc, playlist) => {
      acc[playlist.id] = playlist.audioFiles.some(
        (file) => file.id === song.id
      );
      return acc;
    }, {});
    setSelectedPlaylists(initialSelectedPlaylists);
  };

  return (
    <div className="container mx-auto px-4 py-2">
      {allSongs.length === 0 && (
        <p className="text-gray-500 text-center my-4">{noSongsMessage}</p>
      )}
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
              onClick={(event) => onDeleteSong(song.id, event)}
            >
              <i className="ri-subtract-line text-orange-400 font-bold"></i>
            </button>
          )}
          <div className="col">
            <h5 className="text-xl font-bold">{song.title}</h5>
            <h5 className="text-gray-500 text-sm">
              {song.artist}, {song.year}
            </h5>
          </div>
          <div className="col text-end">
            <h1 className="text-gray-500 text-sm">{song.duration}</h1>
          </div>
          <button
            className={`flex items-center px-2 py-1 border border-orange-400 rounded-full text-orange-400 hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-300 ml-4`}
            title="Додати до плейлисту"
            onClick={(event) => handlePlaylistInteraction(song, event)}
          >
            <i className="ri-add-line text-orange-400 font-bold"></i>
          </button>
        </div>
      ))}
      <AddToPlaylistModal
        playlists={playlists}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPlaylistInteraction={handleUpdateSongInPlaylists}
        selectedPlaylists={selectedPlaylists}
        setSelectedPlaylists={setSelectedPlaylists}
        selectedSong={selectedSong}
        currentUser={currentUser}
      />
    </div>
  );
};

export default SongsList;
