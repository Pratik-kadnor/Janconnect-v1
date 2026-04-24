import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, 
  FiFolder, 
  FiUsers, 
  FiSettings,
  FiBarChart2,
  FiFileText,
  FiUserCheck 
} from 'react-icons/fi';
import { useRole } from '../hooks/useAuth';

const Sidebar = () => {
  const { isAdmin, canManageProjects } = useRole();

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: FiHome,
      show: true,
    },
    {
      name: 'Projects',
      path: '/projects',
      icon: FiFolder,
      show: true,
    },
    {
      name: 'All Users',
      path: '/users',
      icon: FiUsers,
      show: isAdmin,
    },
    {
      name: 'Agencies',
      path: '/agencies',
      icon: FiUserCheck,
      show: canManageProjects,
    },
    {
      name: 'Reports',
      path: '/reports',
      icon: FiFileText,
      show: canManageProjects,
    },
    {
      name: 'Analytics',
      path: '/analytics',
      icon: FiBarChart2,
      show: canManageProjects,
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: FiSettings,
      show: isAdmin,
    },
  ];

  return (
    <aside className="bg-gradient-to-b from-white/90 via-secondary-50/80 to-primary-50/40 dark:from-neutral-900/90 dark:via-primary-900/80 dark:to-primary-800/90 backdrop-blur-sm w-72 min-h-screen shadow-card border-r border-neutral-200/50 dark:border-primary-800/30 transition-colors duration-300">
      <nav className="p-6 space-y-2">
        <div className="mb-8 pb-4 border-b border-neutral-200 dark:border-primary-800/50">
          <p className="text-xs font-semibold text-neutral-500 dark:text-primary-300 uppercase tracking-wider px-4">Navigation</p>
        </div>
        {navItems.filter(item => item.show).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `group flex items-center space-x-4 px-5 py-3.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 text-white font-semibold shadow-soft'
                  : 'text-neutral-700 dark:text-primary-200 hover:bg-secondary-100 dark:hover:bg-primary-900/50 hover:text-primary-700 dark:hover:text-primary-300 font-medium'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`transition-transform duration-200 ${isActive ? '' : 'group-hover:scale-110'}`}>
                  <item.icon size={22} className={isActive ? 'text-white' : 'text-primary-600 dark:text-primary-400'} />
                </div>
                <span className="text-sm font-body tracking-wide">{item.name}</span>
                {isActive && (
                  <div className="ml-auto">
                    <div className="w-2 h-2 bg-accent-400 dark:bg-accent-400 rounded-full animate-pulse"></div>
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
