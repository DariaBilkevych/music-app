import { useContext, useState } from 'react';
import axios from 'axios';
import SongsList from '../components/songs-list';
import SearchInput from '../components/search';
import { PlayerContext } from '../components/player-context';

const LandingPage = ({ currentUser, initialContent }) => {
  const { setCurrentSong } = useContext(PlayerContext);
  const [content, setContentState] = useState(initialContent);

  const handleSelectSong = (song) => {
    setCurrentSong(song);
  };

  const handleSearch = async (query) => {
    if (query) {
      const { data } = await axios.get('/api/content/search', {
        params: { query },
      });
      setContentState(data);
    } else {
      setContentState(initialContent);
    }
  };

  return (
    <div>
      <div className="container overflow-y-auto h-[65vh] p-3">
        <SearchInput onSearch={handleSearch} />
        <SongsList
          allSongs={content}
          onSelectSong={handleSelectSong}
          className="mt-[-4]"
          currentUser={currentUser}
          noSongsMessage="На жаль, за Вашим запитом нічого не знайдено."
        />
      </div>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/content');
  return { initialContent: data };
};

export default LandingPage;
