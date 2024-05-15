import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import useRequest from '../../hooks/use-request';
import SongsList from '../../components/songs-list';
import Player from '../../components/player';
import { PlayerProvider } from '../../components/player-context';

const PlaylistShow = () => {
  const [playlist, setPlaylist] = useState(null);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');
  const [editing, setEditing] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);

  const router = useRouter();
  const { playlistId } = router.query;

  const { doRequest: fetchPlaylist, errors: fetchErrors } = useRequest({
    url: `/api/playlists/${playlistId}`,
    method: 'get',
    onSuccess: (data) => {
      setPlaylist(data), setNewPlaylistTitle(data.title);
    },
  });

  const { doRequest: updatePlaylist, errors: updateErrors } = useRequest({
    url: `/api/playlists/${playlistId}`,
    method: 'put',
    body: {
      title: newPlaylistTitle,
    },
    onSuccess: () => {
      fetchPlaylist();
      setEditing(false);
    },
  });

  const handleDeleteSong = async (audioFileId) => {
    try {
      await axios.delete(`/api/playlists/${playlistId}/${audioFileId}`);
      setPlaylist({
        ...playlist,
        audioFiles: playlist.audioFiles.filter(
          (song) => song.id !== audioFileId
        ),
      });
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

  const handleSelectSong = (song) => setSelectedSong(song);

  useEffect(() => {
    fetchPlaylist();
  }, [router.query]);

  return (
    <PlayerProvider>
      <div className="container mx-auto px-4 py-8">
        {fetchErrors && <div className="alert alert-danger">{fetchErrors}</div>}
        {playlist ? (
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
              {editing ? (
                <input
                  type="text"
                  className="border-b border-orange-500 px-3 py-1 focus:outline-none focus:border-orange-500 text-3xl font-bold"
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
            />
            <Player content={playlist.audioFiles} selectedSong={selectedSong} />
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </PlayerProvider>
  );
};

export default PlaylistShow;
