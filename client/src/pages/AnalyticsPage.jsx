import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  FiTrendingUp,
  FiTrendingDown,
  FiBarChart2,
  FiPieChart,
  FiActivity,
  FiRefreshCw,
  FiDownload,
  FiCalendar,
  FiMapPin,
  FiDollarSign,
  FiCheckCircle,
  FiAlertCircle,
  FiTarget,
  FiUsers
} from 'react-icons/fi';

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Minimal authorization check - PrivateRoute already handles the main check
  useEffect(() => {
    if (!user) {
      console.log('AnalyticsPage: No user found, redirecting to login');
      navigate('/login');
    }
  }, [user, navigate]);

  // State management
  const [projects, setProjects] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('all'); // all, year, quarter, month

  // User data and token
  const token = user?.token || JSON.parse(localStorage.getItem('user'))?.token;

  // Fetch data on mount
  useEffect(() => {
    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError('');
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [projectsRes, agenciesRes] = await Promise.all([
        axios.get('/api/projects', config),
        axios.get('/api/agencies', config)
      ]);

      setProjects(projectsRes.data);
      setAgencies(agenciesRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Filter projects by time range
  const getFilteredProjects = () => {
    if (timeRange === 'all') return projects;

    const now = new Date();
    const cutoffDate = new Date();

    switch (timeRange) {
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return projects;
    }

    return projects.filter(p => new Date(p.createdAt) >= cutoffDate);
  };

  const filteredProjects = getFilteredProjects();

  // Calculate analytics
  const calculateAnalytics = () => {
    const totalProjects = filteredProjects.length;
    const completed = filteredProjects.filter(p => p.status === 'Completed').length;
    const inProgress = filteredProjects.filter(p => p.status === 'In-Progress').length;
    const delayed = filteredProjects.filter(p => p.status === 'Delayed').length;
    const sanctioned = filteredProjects.filter(p => p.status === 'Sanctioned').length;

    const completionRate = totalProjects > 0 ? ((completed / totalProjects) * 100).toFixed(2) : 0;
    const delayRate = totalProjects > 0 ? ((delayed / totalProjects) * 100).toFixed(2) : 0;

    const totalBudget = filteredProjects.reduce((sum, p) => sum + (p.financials?.totalBudget || 0), 0);
    const fundsReleased = filteredProjects.reduce((sum, p) => sum + (p.financials?.fundsReleased || 0), 0);
    const fundsUtilized = filteredProjects.reduce((sum, p) => sum + (p.financials?.fundsUtilized || 0), 0);

    const utilizationRate = totalBudget > 0 ? ((fundsUtilized / totalBudget) * 100).toFixed(2) : 0;
    const releaseRate = totalBudget > 0 ? ((fundsReleased / totalBudget) * 100).toFixed(2) : 0;

    // Component-wise breakdown
    const componentBreakdown = {
      'Adarsh Gram': filteredProjects.filter(p => p.component === 'Adarsh Gram').length,
      'GIA': filteredProjects.filter(p => p.component === 'GIA').length,
      'Hostel': filteredProjects.filter(p => p.component === 'Hostel').length
    };

    // State-wise breakdown
    const stateMap = {};
    filteredProjects.forEach(p => {
      stateMap[p.state] = (stateMap[p.state] || 0) + 1;
    });
    const topStates = Object.entries(stateMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Status distribution
    const statusDistribution = [
      { label: 'Completed', count: completed, color: 'bg-green-500', percentage: totalProjects > 0 ? ((completed / totalProjects) * 100).toFixed(1) : 0 },
      { label: 'In Progress', count: inProgress, color: 'bg-blue-500', percentage: totalProjects > 0 ? ((inProgress / totalProjects) * 100).toFixed(1) : 0 },
      { label: 'Delayed', count: delayed, color: 'bg-red-500', percentage: totalProjects > 0 ? ((delayed / totalProjects) * 100).toFixed(1) : 0 },
      { label: 'Sanctioned', count: sanctioned, color: 'bg-yellow-500', percentage: totalProjects > 0 ? ((sanctioned / totalProjects) * 100).toFixed(1) : 0 }
    ];

    // Monthly trend (last 6 months)
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = date.toLocaleString('default', { month: 'short' });
      const monthProjects = filteredProjects.filter(p => {
        const pDate = new Date(p.createdAt);
        return pDate.getMonth() === date.getMonth() && pDate.getFullYear() === date.getFullYear();
      }).length;
      monthlyTrend.push({ month: monthName, count: monthProjects });
    }

    // Financial trends
    const financialEfficiency = {
      releaseEfficiency: releaseRate,
      utilizationEfficiency: utilizationRate,
      pendingFunds: totalBudget - fundsReleased,
      unusedFunds: fundsReleased - fundsUtilized
    };

    // Agency performance
    const agencyPerformance = agencies.map(agency => {
      const agencyProjects = filteredProjects.filter(p => 
        p.implementingAgency === agency._id || p.executingAgency === agency._id
      );
      const completedProjects = agencyProjects.filter(p => p.status === 'Completed').length;
      const performanceRate = agencyProjects.length > 0 
        ? ((completedProjects / agencyProjects.length) * 100).toFixed(2) 
        : 0;
      
      return {
        name: agency.name,
        type: agency.type,
        state: agency.state,
        totalProjects: agencyProjects.length,
        completedProjects,
        performanceRate
      };
    }).sort((a, b) => b.performanceRate - a.performanceRate).slice(0, 10);

    return {
      totalProjects,
      completed,
      inProgress,
      delayed,
      sanctioned,
      completionRate,
      delayRate,
      totalBudget,
      fundsReleased,
      fundsUtilized,
      utilizationRate,
      releaseRate,
      componentBreakdown,
      topStates,
      statusDistribution,
      monthlyTrend,
      financialEfficiency,
      agencyPerformance
    };
  };

  const analytics = calculateAnalytics();

  // Export analytics data
  const exportAnalytics = () => {
    const data = {
      generatedAt: new Date().toISOString(),
      timeRange,
      summary: {
        totalProjects: analytics.totalProjects,
        completionRate: analytics.completionRate,
        totalBudget: analytics.totalBudget,
        utilizationRate: analytics.utilizationRate
      },
      componentBreakdown: analytics.componentBreakdown,
      statusDistribution: analytics.statusDistribution,
      topStates: analytics.topStates,
      agencyPerformance: analytics.agencyPerformance
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <FiBarChart2 className="text-blue-600" />
              Analytics Dashboard
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Comprehensive insights and performance metrics
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Time Range Selector */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Time</option>
              <option value="year">Last Year</option>
              <option value="quarter">Last Quarter</option>
              <option value="month">Last Month</option>
            </select>

            <button
              onClick={exportAnalytics}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiDownload />
              Export
            </button>

            <button
              onClick={fetchAllData}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FiRefreshCw />
              Refresh
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-2">
            <FiAlertCircle className="text-red-600 dark:text-red-400" />
            <span className="text-red-800 dark:text-red-200">{error}</span>
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Projects</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {analytics.totalProjects}
                </h3>
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1 flex items-center gap-1">
                  <FiActivity />
                  Active tracking
                </p>
              </div>
              <FiTarget className="text-4xl text-blue-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Completion Rate</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {analytics.completionRate}%
                </h3>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                  <FiTrendingUp />
                  {analytics.completed} completed
                </p>
              </div>
              <FiCheckCircle className="text-4xl text-green-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Utilization Rate</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {analytics.utilizationRate}%
                </h3>
                <p className="text-sm text-purple-600 dark:text-purple-400 mt-1 flex items-center gap-1">
                  <FiDollarSign />
                  Fund efficiency
                </p>
              </div>
              <FiDollarSign className="text-4xl text-purple-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Delay Rate</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {analytics.delayRate}%
                </h3>
                <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                  <FiTrendingDown />
                  {analytics.delayed} delayed
                </p>
              </div>
              <FiAlertCircle className="text-4xl text-red-500" />
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <FiPieChart className="text-blue-600" />
            Project Status Distribution
          </h2>
          <div className="space-y-4">
            {analytics.statusDistribution.map((status, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {status.label}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {status.count} ({status.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`${status.color} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${status.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Component & State Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Component Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <FiTarget className="text-green-600" />
              Component-wise Distribution
            </h2>
            <div className="space-y-4">
              {Object.entries(analytics.componentBreakdown).map(([component, count], index) => {
                const percentage = analytics.totalProjects > 0 
                  ? ((count / analytics.totalProjects) * 100).toFixed(1) 
                  : 0;
                const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500'];
                return (
                  <div key={component}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {component}
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className={`${colors[index]} h-3 rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top States */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <FiMapPin className="text-purple-600" />
              Top 5 States by Projects
            </h2>
            <div className="space-y-4">
              {analytics.topStates.map(([state, count], index) => {
                const percentage = analytics.totalProjects > 0 
                  ? ((count / analytics.totalProjects) * 100).toFixed(1) 
                  : 0;
                return (
                  <div key={state} className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {state}
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {count} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <FiCalendar className="text-blue-600" />
            Monthly Project Trend (Last 6 Months)
          </h2>
          <div className="flex items-end justify-between gap-2 h-64">
            {analytics.monthlyTrend.map((item, index) => {
              const maxCount = Math.max(...analytics.monthlyTrend.map(t => t.count), 1);
              const height = (item.count / maxCount) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.count}
                  </span>
                  <div className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg transition-all duration-500 hover:from-blue-600 hover:to-blue-400"
                    style={{ height: `${height}%`, minHeight: '20px' }}
                  />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Financial Efficiency */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white mb-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <FiDollarSign className="text-2xl" />
            Financial Efficiency Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-green-100 text-sm font-medium">Release Efficiency</p>
              <p className="text-3xl font-bold mt-2">{analytics.financialEfficiency.releaseEfficiency}%</p>
              <p className="text-green-100 text-xs mt-1">of budget released</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-green-100 text-sm font-medium">Utilization Efficiency</p>
              <p className="text-3xl font-bold mt-2">{analytics.financialEfficiency.utilizationEfficiency}%</p>
              <p className="text-green-100 text-xs mt-1">of budget utilized</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-green-100 text-sm font-medium">Pending Funds</p>
              <p className="text-2xl font-bold mt-2">
                ₹{analytics.financialEfficiency.pendingFunds.toLocaleString('en-IN')}
              </p>
              <p className="text-green-100 text-xs mt-1">yet to be released</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-green-100 text-sm font-medium">Unused Funds</p>
              <p className="text-2xl font-bold mt-2">
                ₹{analytics.financialEfficiency.unusedFunds.toLocaleString('en-IN')}
              </p>
              <p className="text-green-100 text-xs mt-1">released but not utilized</p>
            </div>
          </div>
        </div>

        {/* Top Performing Agencies */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <FiUsers className="text-blue-600" />
            Top 10 Performing Agencies
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Rank
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Agency Name
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    State
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Total Projects
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Completed
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Performance Rate
                  </th>
                </tr>
              </thead>
              <tbody>
                {analytics.agencyPerformance.map((agency, index) => (
                  <tr 
                    key={index}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index === 0 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                        index === 1 ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' :
                        index === 2 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' :
                        'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      }`}>
                        {index + 1}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                      {agency.name}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        agency.type === 'Implementing' 
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                          : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      }`}>
                        {agency.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                      {agency.state}
                    </td>
                    <td className="py-3 px-4 text-center text-sm font-medium text-gray-900 dark:text-white">
                      {agency.totalProjects}
                    </td>
                    <td className="py-3 px-4 text-center text-sm font-medium text-green-600 dark:text-green-400">
                      {agency.completedProjects}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className={`text-sm font-bold ${
                          parseFloat(agency.performanceRate) >= 75 ? 'text-green-600 dark:text-green-400' :
                          parseFloat(agency.performanceRate) >= 50 ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-red-600 dark:text-red-400'
                        }`}>
                          {agency.performanceRate}%
                        </span>
                        {parseFloat(agency.performanceRate) >= 75 ? <FiTrendingUp className="text-green-600" /> :
                         parseFloat(agency.performanceRate) < 50 ? <FiTrendingDown className="text-red-600" /> : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AnalyticsPage;
