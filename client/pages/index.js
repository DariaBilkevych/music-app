import { useState } from 'react';
import Player from '../components/player';
import SongsList from '../components/songs-list';
import { PlayerProvider } from '../components/context';

const LandingPage = ({ currentUser, content }) => {
  const [selectedSong, setSelectedSong] = useState(null);
  const handleSelectSong = (song) => setSelectedSong(song);

  return (
    <PlayerProvider>
      <div className="container h-screen d-flex flex-column justify-content-center align-items-center">
        <input
          type="text"
          className="form-control mb-3 mt-2"
          placeholder="Назва пісні, виконавець..."
        />
        <SongsList allSongs={content} onSelectSong={handleSelectSong} />{' '}
      </div>
      <Player content={content} selectedSong={selectedSong} />{' '}
    </PlayerProvider>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/content');

  return { content: data };
};

export default LandingPage;
