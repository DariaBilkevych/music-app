import { useState, useContext, useEffect } from 'react';
import Player from '../components/player';
import SongsList from '../components/songs-list';
import { PlayerContext } from '../components/player-context';

const LandingPage = ({ currentUser, content }) => {
  const { setCurrentSong, setContent } = useContext(PlayerContext);
  const handleSelectSong = (song) => {
    setCurrentSong(song);
  };
  useEffect(() => {
    setContent(content);
  });

  return (
    <div>
      <div className="container overflow-y-scroll h-[65vh] p-3">
        <input
          type="text"
          className="form-control mb-3 mt-2 w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Назва пісні, виконавець..."
        />
        <SongsList
          allSongs={content}
          onSelectSong={handleSelectSong}
          className="mt-[-4]"
          currentUser={currentUser}
        />
      </div>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/content');
  return { content: data };
};

export default LandingPage;
