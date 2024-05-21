import React, { useState } from 'react';
import Modal from 'react-modal';
import useRequest from '../hooks/use-request';

const CreatePlaylistModal = ({ isOpen, onClose, onCreate }) => {
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');

  const { doRequest, errors } = useRequest({
    url: '/api/playlists',
    method: 'post',
    body: { title: newPlaylistTitle },
    onSuccess: (playlist) => {
      onCreate(playlist);
      setNewPlaylistTitle('');
      onClose();
    },
  });

  const handleCreatePlaylist = async () => {
    await doRequest();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-120 p-8 rounded-lg shadow-lg"
      overlayClassName="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50"
    >
      <div className="text-center mt-3 mb-3">
        <h2 className="font-bold text-2xl">Створити новий плейлист</h2>
        <button
          onClick={onClose}
          className="absolute top-0 right-0 bg-transparent hover:bg-transparent focus:outline-none p-2"
        >
          <i className="ri-close-line text-orange-400 text-2xl"></i>
        </button>
      </div>
      <input
        type="text"
        placeholder="Введіть назву плейлиста"
        value={newPlaylistTitle}
        onChange={(e) => setNewPlaylistTitle(e.target.value)}
        className="w-full mb-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
      />
      <button
        onClick={handleCreatePlaylist}
        className="block mx-auto bg-gradient-to-r from-orange-400 to-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
      >
        Створити
      </button>
    </Modal>
  );
};

export default CreatePlaylistModal;
