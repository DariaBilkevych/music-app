import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'chart.js/auto';
import { Doughnut } from 'react-chartjs-2';

const TopArtistsChart = () => {
  const [period, setPeriod] = useState('day');
  const [topArtistsData, setTopArtistsData] = useState([]);
  const [dateRange, setDateRange] = useState('');

  useEffect(() => {
    fetchTopArtists();
  }, [period]);

  const fetchTopArtists = async () => {
    try {
      const { data } = await axios.get(
        `/api/statistics/top-artists?period=${period}`
      );
      setTopArtistsData(data);
      setDateRange(
        period === 'day'
          ? `За сьогодні, ${data[0].startDate}, Ви найбільше слухали`
          : data[0]?.startDate && data[0]?.endDate
          ? `З ${data[0].startDate} по ${data[0].endDate} Ви найбільше слухали`
          : ''
      );
    } catch (error) {
      console.error(error);
    }
  };

  const chartData = {
    labels: topArtistsData.map((artist) => artist.artist),
    datasets: [
      {
        data: topArtistsData.map((artist) => artist.totalPlayCount),
        backgroundColor: [
          '#FF8A65',
          '#FFB74D',
          '#FFD54F',
          '#FFD54F',
          '#FF8A65',
        ],
        hoverBackgroundColor: [
          '#FFAB91',
          '#FFCC80',
          '#FFE082',
          '#FFD54F',
          '#FFB74D',
        ],
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.dataset.data[context.dataIndex];
            return `${value} прослуховувань`;
          },
        },
      },
    },
  };

  return (
    <div className="mt-8 bg-white rounded-lg p-4 shadow-lg">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-center mb-4">
          ТОП-5 виконавців
        </h2>
        <div className="flex justify-between">
          <button
            onClick={() => setPeriod('day')}
            className={`focus:outline-none ${
              period === 'day' ? 'text-orange-400 underline' : 'text-gray-500'
            }`}
          >
            <span className="hover:bg-gray-200 px-2 py-1 rounded">День</span>
          </button>
          <button
            onClick={() => setPeriod('week')}
            className={`focus:outline-none ${
              period === 'week' ? 'text-orange-400 underline' : 'text-gray-500'
            }`}
          >
            <span className="hover:bg-gray-200 px-2 py-1 rounded">Тиждень</span>
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`focus:outline-none ${
              period === 'month' ? 'text-orange-400 underline' : 'text-gray-500'
            }`}
          >
            <span className="hover:bg-gray-200 px-2 py-1 rounded">Місяць</span>
          </button>
          <button
            onClick={() => setPeriod('year')}
            className={`focus:outline-none ${
              period === 'year' ? 'text-orange-400 underline' : 'text-gray-500'
            }`}
          >
            <span className="hover:bg-gray-200 px-2 py-1 rounded">Рік</span>
          </button>
        </div>
      </div>
      <div className="text-center mb-4 text-gray-500">{dateRange}</div>
      <div className="flex justify-center">
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
};

export default TopArtistsChart;
