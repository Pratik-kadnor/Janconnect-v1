import React from 'react';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'blue', onClick }) => {
  const colorClasses = {
    blue: 'from-primary-500 to-primary-600 text-white',
    green: 'from-green-500 to-green-600 text-white',
    yellow: 'from-accent-400 to-accent-500 text-white',
    red: 'from-red-500 to-red-600 text-white',
    purple: 'from-purple-500 to-purple-600 text-white',
    indigo: 'from-indigo-500 to-indigo-600 text-white',
    teal: 'from-primary-400 to-primary-500 text-white',
  };

  return (
    <div 
      className={`group bg-gradient-to-br from-white via-white to-primary-50/30 dark:from-neutral-900/80 dark:via-primary-900/60 dark:to-primary-800/80 rounded-2xl shadow-card border border-neutral-200/50 dark:border-primary-800/30 p-6 hover:shadow-hover hover:scale-[1.02] hover:border-primary-200/50 dark:hover:border-primary-600/50 transition-all duration-300 animate-slide-up backdrop-blur-sm ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-neutral-600 dark:text-primary-300 mb-2 font-body uppercase tracking-wide">{title}</p>
          <p className="text-4xl font-heading font-bold text-neutral-900 dark:text-white mb-1">{value}</p>
          {trend && (
            <div className="flex items-center mt-3">
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  trend === 'up' ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400'
                }`}
              >
                {trend === 'up' ? (
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {trendValue}
              </span>
              <span className="text-xs text-neutral-500 dark:text-primary-400 ml-2 font-body">vs last month</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-4 rounded-2xl bg-gradient-to-br ${colorClasses[color]} shadow-soft group-hover:scale-110 transition-transform duration-300`}>
            <Icon size={28} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
