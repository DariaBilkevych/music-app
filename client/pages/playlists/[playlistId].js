import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import useRequest from '../../hooks/use-request';
import SongsList from '../../components/songs-list';
import Loader from '../../components/loader';
import { PlayerContext } from '../../components/player-context';
import toast from 'react-hot-toast';

const PlaylistShow = ({ currentUser }) => {
  const [playlist, setPlaylist] = useState(null);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');
  const [editing, setEditing] = useState(false);
  const {
    setCurrentSong,
    setContent,
    content: playlistAudioFiles,
  } = useContext(PlayerContext);

  const router = useRouter();
  const { playlistId } = router.query;

  const { doRequest: fetchPlaylist } = useRequest({
    url: `/api/playlists/${playlistId}`,
    method: 'get',
    onSuccess: (data) => {
      setPlaylist(data);
      setNewPlaylistTitle(data.title);
      setContent(data.audioFiles);
    },
  });

  const { doRequest: updatePlaylist } = useRequest({
    url: `/api/playlists/${playlistId}`,
    method: 'put',
    body: {
      title: newPlaylistTitle,
    },
    onSuccess: () => {
      fetchPlaylist();
      setEditing(false);
      toast.success('Зміни збережено!');
    },
  });

  const handleDeleteSong = async (audioFileId, event) => {
    event.stopPropagation();
    try {
      await axios.delete(`/api/playlists/${playlistId}/${audioFileId}`);
      setPlaylist((prevPlaylist) => ({
        ...prevPlaylist,
        audioFiles: prevPlaylist.audioFiles.filter(
          (song) => song.id !== audioFileId
        ),
      }));
    } catch (error) {
      console.error('Error deleting song from playlist:', error);
    }
  };

  const handleEditToggle = async () => {
    if (editing) {
      await updatePlaylist();
    }
    setEditing(!editing);
  };

  const handleSelectSong = (song) => {
    setCurrentSong(song);
  };

  useEffect(() => {
    fetchPlaylist();
  }, [router.query]);

  useEffect(() => {
    if (playlist && playlist.title === 'Улюблене') {
      setPlaylist((prevPlaylist) => ({
        ...prevPlaylist,
        audioFiles: playlistAudioFiles,
      }));
    } else if (playlist) {
      setContent(playlist.audioFiles);
    }
  }, [playlistAudioFiles]);

  return (
    <div className="container overflow-y-auto h-[65vh] p-3">
      {playlist ? (
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2 px-4 py-2">
            {editing ? (
              <input
                type="text"
                className="border-b border-orange-500 px-3 py-1 focus:outline-none focus:border-none focus:ring-none text-3xl font-bold border-t-0 border-l-0 border-r-0"
                value={newPlaylistTitle}
                onChange={(e) => setNewPlaylistTitle(e.target.value)}
              />
            ) : (
              <h1 className="text-3xl font-bold">{playlist.title}</h1>
            )}
            <div className="flex items-center">
              <button
                className="flex items-center px-4 py-2 border border-orange-400 text-orange-400 rounded-md hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => router.back()}
              >
                <i className="ri-arrow-left-circle-line text-orange-400 mr-2"></i>
                Назад
              </button>
              <button
                className="flex items-center px-4 py-2 border border-orange-400 text-orange-400 rounded-md hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-300"
                onClick={handleEditToggle}
              >
                {editing ? (
                  <>Зберегти</>
                ) : (
                  <>
                    <i className="ri-edit-2-line mr-2" />
                    Редагувати плейлисти
                  </>
                )}
              </button>
            </div>
          </div>
          <SongsList
            allSongs={playlist.audioFiles}
            onSelectSong={handleSelectSong}
            onDeleteSong={handleDeleteSong}
            isEditing={editing}
            currentUser={currentUser}
            noSongsMessage="Ще не додали жодної пісні? Поверніться до головної сторінки і пошукайте там щось для себе."
          />
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default PlaylistShow;
