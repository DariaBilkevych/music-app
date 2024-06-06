import React, { useEffect, useState, useContext } from 'react';
import { PlayerContext } from '../../components/player-context';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import AdminReasonModal from '../../components/admin-reason-modal';
import Router from 'next/router';

const AdminPanel = ({ content }) => {
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
      <div className="container mx-auto px-4 py-2">
        {content.map((song) => (
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
                {song.artist}, {song.year}
              </h5>
            </div>
            <div className="col text-end">
              <h1 className="text-gray-500 text-sm">{song.duration}</h1>
            </div>
            <button
              className="flex items-center px-2 py-1 border border-red-400 rounded-full text-red-400 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-300 ml-4"
              onClick={() => handleDeleteSong(song.id)}
            >
              <i className="ri-delete-bin-line text-red-400 font-bold"></i>
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

AdminPanel.getInitialProps = async (context, client, currentUser) => {
  if (!currentUser || currentUser.role !== 'admin') {
    if (context.res) {
      context.res.writeHead(302, { Location: '/auth/admin-signin' });
      context.res.end();
    } else {
      Router.replace('/auth/admin-signin');
    }
  }

  const { data } = await client.get('/api/content');
  return { content: data };
};

export default AdminPanel;
