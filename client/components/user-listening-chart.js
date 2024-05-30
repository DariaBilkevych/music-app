import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'chart.js/auto';
import { Line } from 'react-chartjs-2';

const UserListeningChart = () => {
  const [listeningData, setListeningData] = useState([]);

  useEffect(() => {
    fetchListeningData();
  }, []);

  const fetchListeningData = async () => {
    try {
      const { data } = await axios.get('/api/statistics/listening-for-audios');
      setListeningData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const chartData = {
    labels: [],
    datasets: [],
  };

  listeningData.forEach((track) => {
    chartData.labels = Array.from(
      new Set([...chartData.labels, ...track.dates.map((date) => date.date)])
    );
    const playCountData = Array.from({ length: chartData.labels.length }).fill(
      0
    );
    track.dates.forEach((date) => {
      const index = chartData.labels.indexOf(date.date);
      playCountData[index] += date.playCount;
    });
    chartData.datasets.push({
      label: track.title,
      data: playCountData,
      fill: false,
      backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
        Math.random() * 255
      )}, ${Math.floor(Math.random() * 255)}, 0.4)`,
      borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
        Math.random() * 255
      )}, ${Math.floor(Math.random() * 255)}, 1)`,
    });
  });

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Дата прослуховування',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Кількість прослуховувань за день',
        },
      },
    },
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };

  return (
    <div className="mt-8 bg-white rounded-lg p-4 shadow-lg">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-center mb-4">
          Графік прослуховувань власних треків
        </h3>
        <div className="rounded-lg">
          <Line data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default UserListeningChart;
