import React, { useEffect, useState, useContext } from 'react';
import { PlayerContext } from '../../components/player-context';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import AdminReasonModal from '../../components/admin-reason-modal';
import Router from 'next/router';
import SearchInput from '../../components/search';

const AdminDeleteSongs = ({ content }) => {
  const { currentSong, setCurrentSong, setContent } = useContext(PlayerContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [songToDelete, setSongToDelete] = useState(null);
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    setContent(content);
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const { data } = await axios.get('/api/statistics/admin/content');
      setSongs(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectSong = (song) => {
    setCurrentSong(song);
  };

  const handleDeleteSong = (songId, event) => {
    event.stopPropagation();
    setSongToDelete(songId);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSongToDelete(null);
  };

  const handleReasonSubmit = async (reason) => {
    try {
      await axios.delete(`/api/content/admin/${songToDelete}`, {
        data: { reason },
      });
      fetchSongs();
      toast.success('Пісню видалено!');
    } catch (error) {
      console.error(error);
      toast.error('Помилка видалення пісні!');
    }

    handleModalClose();
  };

  const handleSearch = async (query) => {
    if (query) {
      const { data } = await axios.get('/api/statistics/search', {
        params: { query },
      });
      setSongs(data);
      console.log(data);
    } else {
      fetchSongs();
    }
  };

  return (
    <div>
      <div className="container overflow-y-scroll h-[65vh] px-4 py-3">
        <SearchInput onSearch={handleSearch} />
        {songs.map((song) => (
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
              onClick={(event) => handleDeleteSong(song.id, event)}
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
