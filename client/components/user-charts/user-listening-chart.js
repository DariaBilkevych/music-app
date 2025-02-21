import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'chart.js/auto';
import { Line } from 'react-chartjs-2';

const getCurrentMonth = () => {
  return new Date().getMonth() + 1;
};

const UserListeningChart = () => {
  const [listeningData, setListeningData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  useEffect(() => {
    fetchListeningData();
  }, [selectedMonth]);

  const fetchListeningData = async () => {
    try {
      const { data } = await axios.get('/api/statistics/listening-for-audios', {
        params: {
          period: selectedMonth,
        },
      });
      setListeningData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const getUniqueDates = (data) => {
    const dates = new Set();
    data.forEach((track) => {
      track.dates.forEach((date) => dates.add(date.date));
    });
    return Array.from(dates).sort(
      (a, b) =>
        new Date(a.split('-').reverse().join('-')) -
        new Date(b.split('-').reverse().join('-'))
    );
  };

  const fillMissingDates = (dates, uniqueDates) => {
    const filledDates = uniqueDates.map((date) => {
      const foundDate = dates.find((d) => d.date === date);
      return foundDate ? foundDate : { date, playCount: 0 };
    });
    return filledDates;
  };

  const uniqueDates = getUniqueDates(listeningData);
  const filledListeningData = listeningData.map((track) => ({
    title: track.title,
    dates: fillMissingDates(track.dates, uniqueDates),
  }));

  const chartData = {
    labels: uniqueDates,
    datasets: filledListeningData.map((track) => ({
      label: track.title,
      data: track.dates.map((date) => date.playCount),
      fill: false,
      backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
        Math.random() * 255
      )}, ${Math.floor(Math.random() * 255)}, 0.4)`,
      borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
        Math.random() * 255
      )}, ${Math.floor(Math.random() * 255)}, 1)`,
    })),
  };

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
      tooltip: {
        callbacks: {
          label: (context) => {
            const title = context.dataset.label;
            const value = context.dataset.data[context.dataIndex];
            return `${title} - ${value} прослуховувань`;
          },
        },
      },
    },
  };

  return (
    <div className="mt-8 bg-white rounded-lg p-4 shadow-lg">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-center mb-2">
          Графік прослуховувань власних треків
        </h3>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          className="form-select border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-500 w-32"
        >
          <option value={1}>Січень</option>
          <option value={2}>Лютий</option>
          <option value={3}>Березень</option>
          <option value={4}>Квітень</option>
          <option value={5}>Травень</option>
          <option value={6}>Червень</option>
          <option value={7}>Липень</option>
          <option value={8}>Серпень</option>
          <option value={9}>Вересень</option>
          <option value={10}>Жовтень</option>
          <option value={11}>Листопад</option>
          <option value={12}>Грудень</option>
        </select>
        {chartData.datasets.length > 0 && (
          <p className="text-center text-gray-600 text-sm p-3">
            * На цьому графіку відображаються лише треки, що мають
            прослуховування.
          </p>
        )}
        {chartData.datasets.length > 0 ? (
          <div className="rounded-lg">
            <Line data={chartData} options={options} />
          </div>
        ) : (
          <p className="text-center text-gray-500">
            На жаль, у вас ще немає прослуховувань жодного треку.
          </p>
        )}
      </div>
    </div>
  );
};

export default UserListeningChart;
