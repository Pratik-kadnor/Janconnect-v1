import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatDate, getStatusColor } from '../utils/helpers';
import { FiSearch, FiFilter, FiEye } from 'react-icons/fi';

const ProjectTable = ({ projects, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [componentFilter, setComponentFilter] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || project.status === statusFilter;
    const matchesComponent = !componentFilter || project.component === componentFilter;
    return matchesSearch && matchesStatus && matchesComponent;
  });

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (sortField === 'financials.totalBudget') {
      aVal = a.financials?.totalBudget || 0;
      bVal = b.financials?.totalBudget || 0;
    }

    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-900/80 rounded-2xl shadow-card border border-neutral-200 dark:border-primary-800/30 backdrop-blur-sm transition-colors duration-300">
      {/* Filters */}
      <div className="p-6 border-b border-neutral-200 dark:border-primary-800/30">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 dark:text-primary-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-neutral-300 dark:border-primary-700 bg-white dark:bg-primary-900/30 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-primary-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition-colors duration-200"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-neutral-300 dark:border-primary-700 bg-white dark:bg-primary-900/30 text-neutral-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition-colors duration-200"
          >
            <option value="">All Statuses</option>
            <option value="Sanctioned">Sanctioned</option>
            <option value="In-Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Delayed">Delayed</option>
          </select>

          {/* Component Filter */}
          <select
            value={componentFilter}
            onChange={(e) => setComponentFilter(e.target.value)}
            className="px-4 py-3 border border-neutral-300 dark:border-primary-700 bg-white dark:bg-primary-900/30 text-neutral-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition-colors duration-200"
          >
            <option value="">All Components</option>
            <option value="Adarsh Gram">Adarsh Gram</option>
            <option value="GIA">GIA</option>
            <option value="Hostel">Hostel</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary-50 dark:bg-primary-900/50">
            <tr>
              <th
                onClick={() => handleSort('title')}
                className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 dark:text-primary-200 uppercase tracking-wider cursor-pointer hover:bg-secondary-100 dark:hover:bg-primary-800/50 transition-colors"
              >
                Project Title {sortField === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th
                onClick={() => handleSort('component')}
                className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 dark:text-primary-200 uppercase tracking-wider cursor-pointer hover:bg-secondary-100 dark:hover:bg-primary-800/50 transition-colors"
              >
                Component {sortField === 'component' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th
                onClick={() => handleSort('status')}
                className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 dark:text-primary-200 uppercase tracking-wider cursor-pointer hover:bg-secondary-100 dark:hover:bg-primary-800/50 transition-colors"
              >
                Status {sortField === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 dark:text-primary-200 uppercase tracking-wider">
                Executing Agency
              </th>
              <th
                onClick={() => handleSort('financials.totalBudget')}
                className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 dark:text-primary-200 uppercase tracking-wider cursor-pointer hover:bg-secondary-100 dark:hover:bg-primary-800/50 transition-colors"
              >
                Budget {sortField === 'financials.totalBudget' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 dark:text-primary-200 uppercase tracking-wider">
                Progress
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-600 dark:text-primary-200 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-neutral-900/50 divide-y divide-neutral-200 dark:divide-primary-800/30">
            {sortedProjects.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-neutral-500 dark:text-primary-400">
                  No projects found
                </td>
              </tr>
            ) : (
              sortedProjects.map((project) => (
                <tr key={project._id} className="hover:bg-secondary-50 dark:hover:bg-primary-900/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-semibold text-neutral-900 dark:text-white">{project.title}</div>
                      <div className="text-sm text-neutral-500 dark:text-primary-400">{project.state}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-neutral-900 dark:text-primary-200">{project.component}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-primary-300">
                    {project.executingAgency?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900 dark:text-white">
                    {formatCurrency(project.financials?.totalBudget || 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-neutral-200 dark:bg-primary-800/50 rounded-full h-2.5 mr-2">
                        <div
                          className="bg-primary-600 dark:bg-primary-500 h-2.5 rounded-full transition-all"
                          style={{ width: `${project.milestoneProgress || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-neutral-700 dark:text-primary-300">{project.milestoneProgress || 0}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/projects/${project._id}`}
                      className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 inline-flex items-center space-x-1 font-semibold"
                    >
                      <FiEye />
                      <span>View</span>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-neutral-200 dark:border-primary-800/30">
        <p className="text-sm text-neutral-600 dark:text-primary-300 font-medium">
          Showing {sortedProjects.length} of {projects.length} projects
        </p>
      </div>
    </div>
  );
};

export default ProjectTable;
