import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getProjectStats, getProjects } from '../redux/projectSlice';
import { useRole } from '../hooks/useAuth';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import BarChart from '../components/BarChart';
import PieChart from '../components/PieChart';
import { formatCurrency } from '../utils/helpers';
import { 
  FiFolder, 
  FiTrendingUp, 
  FiCheckCircle,
  FiClock,
  FiAlertCircle 
} from 'react-icons/fi';
import { TbCurrencyRupee } from 'react-icons/tb';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { stats, projects, isLoading } = useSelector((state) => state.projects);
  const { isAdmin, isStateAdmin, isAgencyUser } = useRole();

  useEffect(() => {
    dispatch(getProjectStats());
    dispatch(getProjects());
  }, [dispatch]);

  // Prepare chart data
  const statusChartData = stats?.summary ? [
    { name: 'Sanctioned', value: stats.summary.sanctioned },
    { name: 'In Progress', value: stats.summary.inProgress },
    { name: 'Completed', value: stats.summary.completed },
    { name: 'Delayed', value: stats.summary.delayed },
  ] : [];

  const componentChartData = stats?.byComponent?.map(item => ({
    name: item._id,
    count: item.count,
    budget: item.budget,
  })) || [];

  // Get recent projects
  const recentProjects = projects.slice(0, 5);

  // Get pending milestones for agency users
  const pendingMilestones = isAgencyUser
    ? projects
        .flatMap((p) => 
          p.milestones
            ?.filter((m) => m.status === 'Pending')
            .map((m) => ({ ...m, projectTitle: p.title, projectId: p._id }))
        )
        .slice(0, 5)
    : [];

  if (isLoading) {
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
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-neutral-600 dark:text-primary-300 mt-1">
            {isAdmin && 'National dashboard overview'}
            {isStateAdmin && `Dashboard for ${user.state}`}
            {isAgencyUser && 'Your assigned projects and milestones'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Projects"
            value={stats?.summary?.totalProjects || 0}
            icon={FiFolder}
            color="blue"
            onClick={() => navigate('/projects')}
          />
          <StatCard
            title="Total Budget"
            value={formatCurrency(stats?.summary?.totalBudget || 0)}
            icon={TbCurrencyRupee}
            color="green"
          />
          <StatCard
            title="Funds Released"
            value={formatCurrency(stats?.summary?.totalReleased || 0)}
            icon={FiTrendingUp}
            color="indigo"
          />
          <StatCard
            title="Completed"
            value={stats?.summary?.completed || 0}
            icon={FiCheckCircle}
            color="green"
          />
        </div>

        {/* MoSJE Admin & State Admin View */}
        {(isAdmin || isStateAdmin) && (
          <>
            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PieChart
                data={statusChartData}
                dataKey="value"
                nameKey="name"
                title="Projects by Status"
              />
              <BarChart
                data={componentChartData}
                dataKey="count"
                xAxisKey="name"
                title="Projects by Component"
                color="#3b82f6"
              />
            </div>

            {/* Recent Projects */}
            <div className="bg-white dark:bg-neutral-900/80 rounded-xl shadow-card border border-neutral-200 dark:border-primary-800/30 p-6 transition-colors duration-300">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Recent Projects</h3>
              <div className="space-y-3">
                {recentProjects.length === 0 ? (
                  <p className="text-neutral-500 dark:text-primary-400 text-center py-8">No projects available</p>
                ) : (
                  recentProjects.map((project) => (
                    <div
                      key={project._id}
                      className="flex items-center justify-between p-4 bg-secondary-50 dark:bg-primary-900/30 rounded-lg hover:bg-secondary-100 dark:hover:bg-primary-900/40 transition-colors"
                    >
                      <div>
                        <h4 className="font-medium text-neutral-900 dark:text-white">{project.title}</h4>
                        <p className="text-sm text-neutral-500 dark:text-primary-300">
                          {project.component} • {project.state}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          project.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' :
                          project.status === 'In-Progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300' :
                          project.status === 'Delayed' ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300' :
                          'bg-blue-100 text-blue-800 dark:bg-primary-900/60 dark:text-primary-300'
                        }`}>
                          {project.status}
                        </span>
                        <p className="text-sm text-neutral-600 dark:text-primary-200 mt-1">
                          {formatCurrency(project.financials?.totalBudget || 0)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

        {/* Agency User View */}
        {isAgencyUser && (
          <>
            {/* Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="In Progress"
                value={stats?.summary?.inProgress || 0}
                icon={FiClock}
                color="yellow"
              />
              <StatCard
                title="Pending Milestones"
                value={pendingMilestones.length}
                icon={FiAlertCircle}
                color="red"
              />
              <StatCard
                title="Delayed Projects"
                value={stats?.summary?.delayed || 0}
                icon={FiAlertCircle}
                color="red"
              />
            </div>

            {/* Pending Milestones - To-Do List */}
            <div className="bg-white dark:bg-neutral-900/80 rounded-xl shadow-card border border-neutral-200 dark:border-primary-800/30 p-6 transition-colors duration-300">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center">
                <FiAlertCircle className="mr-2 text-orange-500 dark:text-orange-400" />
                Pending Milestones - Action Required
              </h3>
              <div className="space-y-3">
                {pendingMilestones.length === 0 ? (
                  <div className="text-center py-8">
                    <FiCheckCircle className="mx-auto text-green-500 dark:text-green-400 mb-2" size={48} />
                    <p className="text-neutral-500 dark:text-primary-400">All milestones are up to date!</p>
                  </div>
                ) : (
                  pendingMilestones.map((milestone) => (
                    <div
                      key={milestone._id}
                      className="flex items-start p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700/30 rounded-lg"
                    >
                      <FiClock className="text-orange-500 dark:text-orange-400 mt-1 mr-3" size={20} />
                      <div className="flex-1">
                        <h4 className="font-medium text-neutral-900 dark:text-white">{milestone.projectTitle}</h4>
                        <p className="text-sm text-neutral-700 dark:text-primary-200 mt-1">{milestone.description}</p>
                        <p className="text-xs text-neutral-500 dark:text-primary-400 mt-2">
                          Deadline: {new Date(milestone.deadline).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* My Projects */}
            <div className="bg-white dark:bg-neutral-900/80 rounded-xl shadow-card border border-neutral-200 dark:border-primary-800/30 p-6 transition-colors duration-300">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">My Assigned Projects</h3>
              <div className="space-y-3">
                {projects.length === 0 ? (
                  <p className="text-neutral-500 dark:text-primary-400 text-center py-8">No projects assigned</p>
                ) : (
                  projects.slice(0, 5).map((project) => (
                    <div
                      key={project._id}
                      className="flex items-center justify-between p-4 bg-secondary-50 dark:bg-primary-900/30 rounded-lg hover:bg-secondary-100 dark:hover:bg-primary-900/40 transition-colors"
                    >
                      <div>
                        <h4 className="font-medium text-neutral-900 dark:text-white">{project.title}</h4>
                        <p className="text-sm text-neutral-500 dark:text-primary-300">{project.component}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-neutral-200 dark:bg-primary-800/50 rounded-full h-2">
                            <div
                              className="bg-primary-600 dark:bg-primary-500 h-2 rounded-full transition-all"
                              style={{ width: `${project.milestoneProgress || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-neutral-600 dark:text-primary-200">{project.milestoneProgress || 0}%</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default DashboardPage;
