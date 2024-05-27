import React, { useState } from 'react';
import Modal from 'react-modal';
import CreatePlaylistModal from './create-playlist-modal';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';

const AddToPlaylistModal = ({
  currentUser,
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
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-sm p-4 bg-white rounded-lg shadow-lg overflow-auto max-h-96"
      overlayClassName="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-2xl">Додати до плейлиста</h2>
        <button
          className="text-gray-500 hover:bg-transparent focus:outline-none"
          onClick={onClose}
        >
          <i className="ri-close-line text-orange-400 text-2xl"></i>
        </button>
      </div>
      {!currentUser ? (
        <div className="mt-4 text-center">
          <p className="text-gray-500">
            Бажаєте додати пісню до плейлиста? Спочатку{' '}
            <Link
              href="/auth/signup"
              className="text-orange-500 hover:underline"
            >
              зареєструйтесь
            </Link>
          </p>
        </div>
      ) : (
        <>
          <div className="mt-4 text-center">
            <span className="text-gray-500">Не має бажаного плейлисту?</span>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="text-orange-500 hover:underline ml-2 focus:outline-none"
            >
              Створити
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
                  className="form-checkbox h-5 w-5 text-orange-400 rounded-full focus:ring-orange-400 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mr-2"
                />
                <label htmlFor={playlist.id} className="text-base">
                  {playlist.title}
                </label>
              </li>
            ))}
          </ul>
          <button
            onClick={onPlaylistInteraction}
            className="block w-full py-2 mt-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-s"
          >
            Зберегти зміни
          </button>
          <CreatePlaylistModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onCreate={handleCreatePlaylist}
          />
        </>
      )}
    </Modal>
  );
};

export default AddToPlaylistModal;
