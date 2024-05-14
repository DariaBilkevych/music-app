import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

const PlaylistsPage = () => {
  const [playlists, setPlaylists] = useState([]);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get('/api/playlists');
        setPlaylists(response.data);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
    };

    fetchPlaylists();
  }, []);

  const handleEditToggle = () => {
    setEditing(!editing);
  };

  const handleDeletePlaylist = async (id) => {
    try {
      await axios.delete(`/api/playlists/${id}`);
      setPlaylists(playlists.filter((playlist) => playlist.id !== id));
    } catch (error) {
      console.error('Error deleting playlist:', error);
    }
  };

  return (
    <div className="container mx-auto px-8">
      <div className="flex justify-between items-center mb-5 mt-6">
        <Link href="/create-playlist">
          <button className="flex items-center px-4 py-2 border border-orange-400 text-orange-400 rounded-md hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-300">
            <i className="ri-add-line mr-2" /> Створити плейлист
          </button>
        </Link>
        <button
          onClick={handleEditToggle}
          className="flex items-center px-4 py-2 border border-orange-400 text-orange-400 rounded-md hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-300"
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
      <div className="row mt-5">
        {playlists.map((playlist) => (
          <div key={playlist.id} className="col-md-4">
            <div className="playlist-card bg-white rounded-lg shadow-md p-4 mb-3 hover:shadow-orange-300 hover:shadow-md hover:shadow-spread-radius-2">
              <div className="flex justify-between items-center">
                <Link href={`/playlists/${playlist.id}`}>
                  <h5 className="card-title text-xl font-bold cursor-pointer">
                    {playlist.title}
                  </h5>
                </Link>
                {editing && (
                  <button
                    onClick={() => handleDeletePlaylist(playlist.id)}
                    className="flex items-center px-2 py-1 rounded-md border border-gray-300 hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-300"
                  >
                    <i className="ri-delete-bin-5-fill text-orange-400 text-2xl"></i>
                  </button>
                )}
              </div>
              <div className="playlist-duration text-gray-500">
                <span>
                  Загальна кількість треків: {playlist.audioFilesCount}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistsPage;
