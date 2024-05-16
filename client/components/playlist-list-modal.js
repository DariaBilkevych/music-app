import React from 'react';
import Modal from 'react-modal';

const PlaylistListModal = ({
  playlists,
  isOpen,
  onClose,
  onAddSongToPlaylist,
}) => {
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
            onClick={() => onAddSongToPlaylist(playlist)}
          >
            <i className="ri-playlist-line text-orange-500 mr-2"></i>
            <span className="text-base">{playlist.title}</span>
          </li>
        ))}
      </ul>
    </Modal>
  );
};

export default PlaylistListModal;
