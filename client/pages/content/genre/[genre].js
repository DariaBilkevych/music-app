import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from 'react';
import { PlayerContext } from '../../../components/player-context';
import SongsList from '../../../components/songs-list';
import Loader from '../../../components/loader';

const GenrePage = ({ currentUser }) => {
  const router = useRouter();
  const { genre } = router.query;
  const [audioFiles, setAudioFiles] = useState([]);
  const { setCurrentSong, setContent } = useContext(PlayerContext);

  useEffect(() => {
    const fetchAudioFiles = async () => {
      try {
        const response = await fetch(
          `/api/content/genre/${encodeURIComponent(genre)}`
        );
        const data = await response.json();
        setAudioFiles(data);
        setContent(data);
      } catch (error) {
        console.error('Error fetching audio files:', error.message);
      }
    };

    if (genre) {
      fetchAudioFiles();
    }
  }, [genre]);

  const handleSelectSong = (song) => {
    setCurrentSong(song);
  };

  if (!genre) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto mt-3">
      <div className="flex items-center justify-between px-4 py-2">
        <h1 className="text-3xl font-bold">
          {genre.charAt(0).toUpperCase() + genre.slice(1)} пісні
        </h1>
        <button
          className="flex items-center px-4 py-2 border border-orange-400 text-orange-400 rounded-md hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() => router.back()}
        >
          <i className="ri-arrow-left-circle-line text-orange-400 mr-2"></i>
          Назад
        </button>
      </div>
      <SongsList
        allSongs={audioFiles}
        onSelectSong={handleSelectSong}
        currentUser={currentUser}
        noSongsMessage="Ще не має пісень такого жанру? Ви можете стати першим, завантаживши свої."
      />
    </div>
  );
};

export default GenrePage;
