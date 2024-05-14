import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';
import SongsList from '../../components/songs-list';
import Player from '../../components/player';
import { PlayerProvider } from '../../components/player-context';

const PlaylistShow = () => {
  const [playlist, setPlaylist] = useState(null);
  const [selectedSong, setSelectedSong] = useState(null);
  const handleSelectSong = (song) => setSelectedSong(song);

  const { playlistId } = Router.useRouter().query;

  const { doRequest, errors } = useRequest({
    url: `/api/playlists/${playlistId}`,
    method: 'get',
    onSuccess: (data) => setPlaylist(data),
  });

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        await doRequest();
      } catch (error) {
        console.error('Error fetching playlist:', error);
      }
    };

    fetchPlaylist();
  }, [Router.useRouter().query]);

  return (
    <PlayerProvider>
      <div className="container mx-auto px-4 py-8">
        {errors && <div className="alert alert-danger">{errors}</div>}
        {playlist ? (
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold">{playlist.title}</h1>
              <div className="flex items-center">
                <button
                  className="flex items-center px-4 py-2 border border-orange-400 text-orange-400 rounded-md hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-300"
                  onClick={() => Router.push('/playlists/all')}
                >
                  <i className="ri-arrow-left-circle-line text-orange-400 mr-2"></i>
                  Назад
                </button>
                <button
                  className="flex items-center px-4 py-2 border border-orange-400 text-orange-400 rounded-md hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => Router.push(`/playlists/${playlistId}`)}
                >
                  <i className="ri-edit-2-line text-orange-400 mr-2"></i>{' '}
                  Редагувати
                </button>
              </div>
            </div>
            <SongsList
              allSongs={playlist.audioFiles}
              onSelectSong={handleSelectSong}
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
