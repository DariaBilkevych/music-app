import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'chart.js/auto';
import { Doughnut } from 'react-chartjs-2';

const UniversalChart = ({ apiUrl, title, labelsCallback }) => {
  const [period, setPeriod] = useState('day');
  const [chartData, setChartData] = useState([]);
  const [dateRange, setDateRange] = useState('');

  useEffect(() => {
    fetchData();
  }, [period]);

  const fetchData = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}?period=${period}`);
      setChartData(data);
      setDateRange(
        period === 'day'
          ? `За сьогодні, ${data[0].startDate}, найбільше слухали`
          : data[0]?.startDate && data[0]?.endDate
          ? `З ${data[0].startDate} по ${data[0].endDate} найбільше слухали`
          : ''
      );
    } catch (error) {
      console.error(error);
    }
  };

  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const adjustColorTone = (color, percent) => {
    const parseColor = (color) => parseInt(color, 16);
    const modifyColor = (color) => {
      const clampedColor = Math.min(255, Math.max(0, color));
      return clampedColor.toString(16).padStart(2, '0');
    };

    const r = parseColor(color.substring(1, 3));
    const g = parseColor(color.substring(3, 5));
    const b = parseColor(color.substring(5, 7));

    const adjustedR = r + Math.floor((255 - r) * percent);
    const adjustedG = g + Math.floor((255 - g) * percent);
    const adjustedB = b + Math.floor((255 - b) * percent);

    return `#${modifyColor(adjustedR)}${modifyColor(adjustedG)}${modifyColor(
      adjustedB
    )}`;
  };

  const colors = chartData.map(() => generateRandomColor());

  const data = {
    labels: chartData.map(labelsCallback),
    datasets: [
      {
        data: chartData.map((item) => item.totalPlayCount),
        backgroundColor: colors,
        hoverBackgroundColor: colors.map((color) =>
          adjustColorTone(color, -0.5)
        ),
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
    <div className="bg-white rounded-lg p-2 shadow-lg">
      <div className="mb-2">
        <h2 className="text-lg font-semibold text-center mb-2">{title}</h2>
        <div className="flex justify-between text-sm">
          <button
            onClick={() => setPeriod('day')}
            className={`focus:outline-none ${
              period === 'day' ? 'text-orange-400 underline' : 'text-gray-500'
            }`}
          >
            <span className="hover:bg-gray-200 px-1 py-1 rounded">День</span>
          </button>
          <button
            onClick={() => setPeriod('week')}
            className={`focus:outline-none ${
              period === 'week' ? 'text-orange-400 underline' : 'text-gray-500'
            }`}
          >
            <span className="hover:bg-gray-200 px-1 py-1 rounded">Тиждень</span>
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`focus:outline-none ${
              period === 'month' ? 'text-orange-400 underline' : 'text-gray-500'
            }`}
          >
            <span className="hover:bg-gray-200 px-1 py-1 rounded">Місяць</span>
          </button>
          <button
            onClick={() => setPeriod('year')}
            className={`focus:outline-none ${
              period === 'year' ? 'text-orange-400 underline' : 'text-gray-500'
            }`}
          >
            <span className="hover:bg-gray-200 px-1 py-1 rounded">Рік</span>
          </button>
        </div>
      </div>
      {chartData.length === 0 ? (
        <div className="text-center text-gray-500 text-sm">
          Немає даних про прослуховування за обраний період
        </div>
      ) : (
        <>
          <div className="text-center mb-2 text-gray-500 text-sm">
            {dateRange}
          </div>
          <div className="flex justify-center">
            <div>
              <Doughnut data={data} options={options} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UniversalChart;
