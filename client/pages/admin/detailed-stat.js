import React from 'react';
import UniversalChart from '../../components/admin-charts/universal-chart';
import AdminListeningChart from '../../components/admin-charts/total-listening-chart';

const DetailedStatistics = () => {
  return (
    <div className="container overflow-y-auto h-[65vh] px-4 py-3 flex flex-col items-center">
      <div className="flex justify-between w-full">
        <div className="w-1/3 p-2">
          <UniversalChart
            apiUrl="/api/statistics/admin/top-artists"
            title="ТОП-10 виконавців"
            labelsCallback={(item) => item.artist}
          />
        </div>
        <div className="w-1/3 p-2">
          <UniversalChart
            apiUrl="/api/statistics/admin/top-genres"
            title="ТОП-5 жанрів"
            labelsCallback={(item) => item.genre}
          />
        </div>
        <div className="w-1/3 p-2">
          <UniversalChart
            apiUrl="/api/statistics/admin/top-songs"
            title="ТОП-10 пісень"
            labelsCallback={(item) => `${item.title} - ${item.artist}`}
          />
        </div>
      </div>
      <div className="w-1/2 mt-8 p-2">
        <AdminListeningChart />
      </div>
    </div>
  );
};

DetailedStatistics.getInitialProps = async (context, client, currentUser) => {
  if (!currentUser || currentUser.role !== 'admin') {
    if (context.res) {
      context.res.writeHead(302, { Location: '/auth/admin-signin' });
      context.res.end();
    } else {
      Router.replace('/auth/admin-signin');
    }
  }
};

export default DetailedStatistics;
