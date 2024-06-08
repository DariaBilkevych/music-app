import React, { useEffect, useState, useContext } from 'react';
import { PlayerContext } from '../../components/player-context';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import AdminReasonModal from '../../components/admin-reason-modal';
import Router from 'next/router';

const AdminDeleteSongs = ({ content }) => {
  const { currentSong, setCurrentSong, setContent } = useContext(PlayerContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [songToDelete, setSongToDelete] = useState(null);

  const handleSelectSong = (song) => {
    setCurrentSong(song);
  };

  useEffect(() => {
    setContent(content);
  }, []);

  const handleDeleteSong = (songId) => {
    setSongToDelete(songId);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSongToDelete(null);
  };

  const handleReasonSubmit = async (reason) => {
    try {
      const response = await axios.delete(
        `/api/content/admin/${songToDelete}`,
        { data: { reason } }
      );

      if (response.status === 204) {
        toast.success('Пісню видалено!');
        const updatedContent = content.filter(
          (song) => song.id !== songToDelete
        );
        setContent(updatedContent);
      } else {
        toast.error('Помилка видалення пісні!');
      }
    } catch (error) {
      console.error(error);
      toast.error('Помилка видалення пісні!');
    }

    handleModalClose();
  };

  return (
    <div>
      <div className="container overflow-y-scroll h-[65vh] px-4 py-3">
        <input
          type="text"
          className="form-control mb-3 mt-2 w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Назва пісні, виконавець..."
        />
        {content.map((song) => (
          <div
            key={song.id}
            className={`list-group-item d-flex justify-content-between align-items-center rounded-md hover:bg-stone-100 shadow-sm cursor-pointer py-2 px-3 mb-2 ${
              currentSong && currentSong.id === song.id
                ? 'bg-stone-100 font-bold text-orange-400'
                : ''
            }`}
            onClick={() => handleSelectSong(song)}
          >
            <div className="col">
              <h5 className="text-lg font-semibold">{song.title}</h5>
              <h5 className="text-gray-500 text-sm">
                {song.artist}, {song.year}
              </h5>
              <h5 className="text-gray-500 text-xs mt-1">
                Завантажено на сервер: {song.userId.name} ({song.userId.email})
              </h5>
            </div>
            <div className="col text-end">
              <h5 className="text-gray-500 text-xs">{song.duration}</h5>
            </div>
            <button
              className="flex items-center px-2 py-1 border border-red-400 rounded-full text-red-400 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-300 ml-3"
              onClick={() => handleDeleteSong(song.id)}
            >
              <i className="ri-delete-bin-line text-red-400 font-bold text-lg"></i>
            </button>
          </div>
        ))}
      </div>
      <AdminReasonModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onDelete={handleReasonSubmit}
      />
    </div>
  );
};

AdminDeleteSongs.getInitialProps = async (context, client, currentUser) => {
  if (!currentUser || currentUser.role !== 'admin') {
    if (context.res) {
      context.res.writeHead(302, { Location: '/auth/admin-signin' });
      context.res.end();
    } else {
      Router.replace('/auth/admin-signin');
    }
  }

  const { data } = await client.get('/api/statistics/admin/content');
  return { content: data };
};

export default AdminDeleteSongs;
