import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/authSlice';
import { FiLogOut, FiUser, FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const { isDarkMode, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="bg-white/80 dark:bg-neutral-900/80 shadow-soft border-b border-neutral-200/50 dark:border-primary-800/30 sticky top-0 z-50 backdrop-blur-lg transition-colors duration-300">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Logo Section */}
        <div className="flex items-center space-x-4 group">
          <div className="w-12 h-12 bg-white dark:bg-white rounded-xl flex items-center justify-center p-1.5 border border-neutral-300 dark:border-primary-500/50 shadow-card group-hover:shadow-hover transition-all duration-300">
            <img src="/assets/logo.png" alt="JanConnect Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-xl font-heading font-bold text-neutral-900 dark:text-white tracking-tight">JanConnect</h1>
            <p className="text-xs font-body text-primary-600 dark:text-primary-400 font-medium">PM-AJAY Portal</p>
          </div>
        </div>

        {/* User Section */}
        <div className="flex items-center space-x-6">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="relative p-3 rounded-xl bg-secondary-100 dark:bg-primary-900/40 border border-neutral-300 dark:border-primary-700/50 hover:shadow-soft transition-all duration-300 group"
            aria-label="Toggle dark mode"
          >
            <div className="relative w-5 h-5">
              {/* Sun Icon */}
              <FiSun 
                className={`absolute inset-0 text-amber-500 transition-all duration-300 ${
                  isDarkMode ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
                }`} 
                size={20} 
              />
              {/* Moon Icon */}
              <FiMoon 
                className={`absolute inset-0 text-primary-400 transition-all duration-300 ${
                  isDarkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
                }`} 
                size={20} 
              />
            </div>
          </button>

          <button
            onClick={() => navigate('/profile')}
            className="flex items-center space-x-4 px-4 py-2 bg-secondary-50 dark:bg-primary-900/30 rounded-xl border border-secondary-200/50 dark:border-primary-700/50 hover:bg-secondary-100 dark:hover:bg-primary-900/50 hover:shadow-soft transition-all duration-300 group"
          >
            <div className="text-right">
              <p className="text-sm font-semibold text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{user?.name}</p>
              <p className="text-xs text-primary-600 dark:text-primary-300 font-medium">{user?.role?.replace('-', ' ')}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-500 dark:to-primary-600 rounded-full flex items-center justify-center shadow-soft group-hover:shadow-card transition-all">
              <FiUser className="text-white" size={20} />
            </div>
          </button>
          
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-5 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400 hover:text-white hover:bg-red-600 dark:hover:bg-red-700 border border-red-200 dark:border-red-800 hover:border-red-600 rounded-xl transition-all duration-200 shadow-sm hover:shadow-card"
          >
            <FiLogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
