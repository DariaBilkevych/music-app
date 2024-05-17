import React, { useState } from 'react';
import Modal from 'react-modal';
import CreatePlaylistModal from './create-playlist-modal';
import axios from 'axios';
import { useRouter } from 'next/router';

const PlaylistListModal = ({
  playlists,
  isOpen,
  onClose,
  onPlaylistInteraction,
  selectedPlaylists,
  setSelectedPlaylists,
  selectedSong,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const router = useRouter();

  const handleCheckboxChange = (playlistId) => {
    setSelectedPlaylists((prevState) => ({
      ...prevState,
      [playlistId]: !prevState[playlistId],
    }));
  };

  const handleCreatePlaylist = async (title) => {
    try {
      const response = await axios.post('/api/playlists', { title });
      const newPlaylist = response.data;

      await axios.post(`/api/playlists/${newPlaylist.id}/add-audio`, {
        audioFileId: selectedSong.id,
      });

      playlists.push(newPlaylist);
      setSelectedPlaylists((prevState) => ({
        ...prevState,
        [newPlaylist.id]: true,
      }));

      router.push(`/playlists/${newPlaylist.id}`);
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm p-4 bg-white rounded-lg shadow-lg"
      overlayClassName="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-lg">Додати до плейлиста</h2>
        <button
          className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
          onClick={onClose}
        >
          <i className="ri-close-line text-orange-400 text-xl"></i>
        </button>
      </div>
      <ul className="mt-4 overflow-auto h-full">
        {playlists.map((playlist) => (
          <li
            key={playlist.id}
            className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
          >
            <input
              type="checkbox"
              id={playlist.id}
              checked={selectedPlaylists[playlist.id] || false}
              onChange={() => handleCheckboxChange(playlist.id)}
              className="mr-2"
            />
            <label htmlFor={playlist.id} className="text-base">
              {playlist.title}
            </label>
          </li>
        ))}
      </ul>
      <button
        onClick={onPlaylistInteraction}
        className="block w-full py-2 mt-4 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        Зберегти зміни
      </button>
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="block w-full py-2 mt-2 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
      >
        Створити новий плейлист
      </button>
      <CreatePlaylistModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreatePlaylist}
      />
    </Modal>
  );
};

export default PlaylistListModal;
