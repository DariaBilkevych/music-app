import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../../components/loader';

const AdminOverallStats = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/statistics/admin/overal-stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching overall stats:', error);
      }
    };

    fetchStats();
  }, []);

  if (!stats) {
    return <Loader />;
  }

  return (
    <div className="container overflow-y-auto h-[65vh] px-4 py-3 flex justify-center">
      <div className="max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
        <div className="bg-white rounded-lg shadow-md p-3 mb-8 border-t-4 border-orange-400 border-solid border-b-0 shadow-orange-300">
          <h3 className="text-lg font-semibold mb-2">
            Загальна к-сть користувачів
          </h3>
          <p>{stats.totalUsers}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-3 mb-8 border-t-4 border-orange-400 border-solid border-b-0 shadow-orange-300">
          <h3 className="text-lg font-semibold mb-2">Загальна к-сть пісень</h3>
          <p>{stats.totalSongs}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-3 mb-8 border-t-4 border-orange-400 border-solid border-b-0 shadow-orange-300">
          <h3 className="text-lg font-semibold mb-2">
            Загальна к-сть прослуховувань
          </h3>
          <p>{stats.totalPlays}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-3 mb-8 border-t-4 border-orange-400 border-solid border-b-0 shadow-orange-300">
          <h3 className="text-lg font-semibold mb-2">Найпопулярніша пісня</h3>
          {stats.topSong && (
            <div>
              <p className="font-semibold">
                {stats.topSong.title} - {stats.topSong.artist}{' '}
              </p>
              <p>К-сть прослуховувань: {stats.topSong.totalPlays}</p>
            </div>
          )}
        </div>
        <div className="bg-white rounded-lg shadow-md p-3 mb-8 border-t-4 border-orange-400 border-solid border-b-0 shadow-orange-300">
          <h3 className="text-lg font-semibold mb-2">
            Найпопулярніший виконавець
          </h3>
          {stats.topArtist && (
            <div>
              <p className="font-semibold">{stats.topArtist.artist}</p>
              <p>К-сть прослуховувань: {stats.topArtist.totalPlays}</p>
            </div>
          )}
        </div>
        <div className="bg-white rounded-lg shadow-md p-3 mb-8 border-t-4 border-orange-400 border-solid border-b-0 shadow-orange-300">
          <h3 className="text-lg font-semibold mb-2">Найпопулярніший жанр</h3>
          {stats.topGenre && (
            <div>
              <p className="font-semibold">{stats.topGenre._id}</p>
              <p>К-сть прослуховувань: {stats.topGenre.totalPlays}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

AdminOverallStats.getInitialProps = async (context, client, currentUser) => {
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

export default AdminOverallStats;
