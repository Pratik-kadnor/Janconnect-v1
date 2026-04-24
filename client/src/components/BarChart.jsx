import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';

const BarChart = ({ data, dataKey, xAxisKey, title, color = '#3b82f6' }) => {
  const { isDarkMode } = useTheme();

  // Custom tooltip for dark mode
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 rounded-lg shadow-lg border ${
          isDarkMode 
            ? 'bg-neutral-800 border-primary-700 text-white' 
            : 'bg-white border-gray-200 text-gray-900'
        }`}>
          <p className="font-semibold">{label}</p>
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
        <RechartsBarChart data={data}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={isDarkMode ? '#374151' : '#e5e7eb'}
          />
          <XAxis 
            dataKey={xAxisKey}
            stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
            style={{
              fontSize: '12px',
              fill: isDarkMode ? '#e5e7eb' : '#374151',
            }}
          />
          <YAxis 
            stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
            style={{
              fontSize: '12px',
              fill: isDarkMode ? '#e5e7eb' : '#374151',
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{
              color: isDarkMode ? '#e5e7eb' : '#374151',
            }}
          />
          <Bar dataKey={dataKey} fill={color} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
