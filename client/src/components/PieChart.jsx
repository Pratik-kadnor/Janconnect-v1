import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const PieChart = ({ data, dataKey, nameKey, title }) => {
  const { isDarkMode } = useTheme();

  // Custom tooltip for dark mode
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 rounded-lg shadow-lg border ${
          isDarkMode 
            ? 'bg-neutral-800 border-primary-700 text-white' 
            : 'bg-white border-gray-200 text-gray-900'
        }`}>
          <p className="font-semibold">{payload[0].name}</p>
          <p className={isDarkMode ? 'text-primary-300' : 'text-gray-600'}>
            {payload[0].value} projects
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-neutral-900/80 rounded-xl shadow-card border border-neutral-200 dark:border-primary-800/30 p-6 transition-colors duration-300">
      {title && (
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <RechartsPieChart>
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label={{
              fill: isDarkMode ? '#e5e7eb' : '#374151',
              fontSize: 12,
            }}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{
              color: isDarkMode ? '#e5e7eb' : '#374151',
            }}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChart;
