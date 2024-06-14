import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'chart.js/auto';
import { Line } from 'react-chartjs-2';

const getCurrentMonth = () => {
  return new Date().getMonth() + 1;
};

const AdminListeningChart = () => {
  const [listeningData, setListeningData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  useEffect(() => {
    fetchListeningData();
  }, [selectedMonth]);

  const fetchListeningData = async () => {
    try {
      const { data } = await axios.get(
        '/api/statistics/admin/total-listening',
        {
          params: {
            period: selectedMonth,
          },
        }
      );
      setListeningData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const chartData = {
    labels: listeningData.map((entry) => entry.date),
    datasets: [
      {
        label: 'Кількість прослуховувань',
        data: listeningData.map((entry) => entry.playCount),
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.4)',
        borderColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Дата',
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
        position: 'top',
      },
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
        <h3 className="text-xl font-semibold text-center mb-2">
          Загальна кількість прослуховувань за обраний місяць
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
        {chartData.datasets[0].data.length > 0 ? (
          <div className="rounded-lg">
            <Line data={chartData} options={options} />
          </div>
        ) : (
          <p className="text-center text-gray-500">
            На жаль, немає даних для обраного місяця.
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminListeningChart;
