import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProjectById, updateMilestone } from '../redux/projectSlice';
import Layout from '../components/Layout';
import MilestoneTracker from '../components/MilestoneTracker';
import FileUploadModal from '../components/FileUploadModal';
import { formatCurrency, formatDate, getStatusColor } from '../utils/helpers';
import { 
  FiArrowLeft, 
  FiEdit, 
  FiMapPin, 
  FiCalendar, 
  FiDollarSign,
  FiUsers,
  FiUpload 
} from 'react-icons/fi';
import { useRole } from '../hooks/useAuth';

const SingleProjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { project, isLoading } = useSelector((state) => state.projects);
  const { canManageProjects, isAgencyUser } = useRole();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState(null);

  useEffect(() => {
    dispatch(getProjectById(id));
  }, [dispatch, id]);

  const handleMilestoneUpdate = (milestoneId, data) => {
    dispatch(updateMilestone({ projectId: id, milestoneId, milestoneData: data }));
  };

  const handleFileUploadSuccess = (url) => {
    if (selectedMilestoneId) {
      handleMilestoneUpdate(selectedMilestoneId, { evidenceUrl: url });
    }
  };

  const openUploadModal = (milestoneId) => {
    setSelectedMilestoneId(milestoneId);
    setUploadModalOpen(true);
  };

  if (isLoading || !project) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/projects')}
              className="p-2 hover:bg-secondary-100 dark:hover:bg-primary-900/40 rounded-lg transition-colors text-neutral-700 dark:text-primary-200"
            >
              <FiArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">{project.title}</h1>
              <p className="text-neutral-600 dark:text-primary-300 mt-1">Project Details</p>
            </div>
          </div>
          {canManageProjects && (
            <button
              onClick={() => navigate(`/projects/${id}/edit`)}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 dark:bg-primary-700 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors shadow-sm"
            >
              <FiEdit size={18} />
              <span>Edit Project</span>
            </button>
          )}
        </div>

        {/* Status Badge */}
        <div>
          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(project.status)}`}>
            {project.status}
          </span>
        </div>

        {/* Main Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="bg-white dark:bg-neutral-900/80 rounded-xl shadow-card border border-neutral-200 dark:border-primary-800/30 p-6 transition-colors duration-300">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Basic Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FiMapPin className="text-neutral-400 dark:text-primary-500" />
                <div>
                  <p className="text-sm text-neutral-500 dark:text-primary-400">Location</p>
                  <p className="font-medium text-neutral-900 dark:text-white">{project.state}, {project.district}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-neutral-500 dark:text-primary-400">Component</p>
                <p className="font-medium text-neutral-900 dark:text-white">{project.component}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500 dark:text-primary-400">Beneficiaries</p>
                <p className="font-medium text-neutral-900 dark:text-white">{project.beneficiaries || 'N/A'}</p>
              </div>
              {project.description && (
                <div>
                  <p className="text-sm text-neutral-500 dark:text-primary-400">Description</p>
                  <p className="text-neutral-900 dark:text-primary-200">{project.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Agencies */}
          <div className="bg-white dark:bg-neutral-900/80 rounded-xl shadow-card border border-neutral-200 dark:border-primary-800/30 p-6 transition-colors duration-300">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Agencies</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-neutral-500 dark:text-primary-400 mb-1">Implementing Agency</p>
                <div className="flex items-center space-x-2">
                  <FiUsers className="text-primary-500 dark:text-primary-400" />
                  <p className="font-medium text-neutral-900 dark:text-white">
                    {project.implementingAgency?.name || 'N/A'}
                  </p>
                </div>
                {project.implementingAgency?.nodalOfficer && (
                  <p className="text-sm text-neutral-600 dark:text-primary-300 mt-1">
                    Contact: {project.implementingAgency.nodalOfficer.name}
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm text-neutral-500 dark:text-primary-400 mb-1">Executing Agency</p>
                <div className="flex items-center space-x-2">
                  <FiUsers className="text-green-500 dark:text-green-400" />
                  <p className="font-medium text-neutral-900 dark:text-white">
                    {project.executingAgency?.name || 'N/A'}
                  </p>
                </div>
                {project.executingAgency?.nodalOfficer && (
                  <p className="text-sm text-neutral-600 dark:text-primary-300 mt-1">
                    Contact: {project.executingAgency.nodalOfficer.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white dark:bg-neutral-900/80 rounded-xl shadow-card border border-neutral-200 dark:border-primary-800/30 p-6 transition-colors duration-300">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Timeline</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FiCalendar className="text-neutral-400 dark:text-primary-500" />
                <div>
                  <p className="text-sm text-neutral-500 dark:text-primary-400">Sanction Date</p>
                  <p className="font-medium text-neutral-900 dark:text-white">{formatDate(project.sanctionDate)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FiCalendar className="text-neutral-400 dark:text-primary-500" />
                <div>
                  <p className="text-sm text-neutral-500 dark:text-primary-400">Expected Completion</p>
                  <p className="font-medium text-neutral-900 dark:text-white">{formatDate(project.expectedCompletionDate)}</p>
                </div>
              </div>
              {project.actualCompletionDate && (
                <div className="flex items-center space-x-3">
                  <FiCalendar className="text-green-500 dark:text-green-400" />
                  <div>
                    <p className="text-sm text-neutral-500 dark:text-primary-400">Actual Completion</p>
                    <p className="font-medium text-neutral-900 dark:text-white">{formatDate(project.actualCompletionDate)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Financial Details */}
          <div className="bg-white dark:bg-neutral-900/80 rounded-xl shadow-card border border-neutral-200 dark:border-primary-800/30 p-6 transition-colors duration-300">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Financial Details</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FiDollarSign className="text-neutral-400 dark:text-primary-500" />
                  <span className="text-sm text-neutral-500 dark:text-primary-400">Total Budget</span>
                </div>
                <span className="font-semibold text-neutral-900 dark:text-white">
                  {formatCurrency(project.financials?.totalBudget || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500 dark:text-primary-400 ml-6">Funds Released</span>
                <span className="font-medium text-primary-600 dark:text-primary-400">
                  {formatCurrency(project.financials?.fundsReleased || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500 dark:text-primary-400 ml-6">Funds Utilized</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {formatCurrency(project.financials?.fundsUtilized || 0)}
                </span>
              </div>
              <div className="pt-3 border-t border-neutral-200 dark:border-primary-800/30">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-700 dark:text-primary-300">Utilization Rate</span>
                  <span className="text-lg font-bold text-neutral-900 dark:text-white">
                    {project.utilizationPercentage || 0}%
                  </span>
                </div>
                <div className="mt-2 w-full bg-neutral-200 dark:bg-primary-800/50 rounded-full h-2">
                  <div
                    className="bg-green-600 dark:bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.utilizationPercentage || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Milestones Section */}
        <div className="bg-white dark:bg-neutral-900/80 rounded-xl shadow-card border border-neutral-200 dark:border-primary-800/30 p-6 transition-colors duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Milestones</h3>
            {isAgencyUser && (
              <button
                onClick={() => openUploadModal(null)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 dark:bg-primary-700 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors shadow-sm"
              >
                <FiUpload size={18} />
                <span>Upload Evidence</span>
              </button>
            )}
          </div>
          <MilestoneTracker
            milestones={project.milestones}
            onUpdate={handleMilestoneUpdate}
            canEdit={isAgencyUser || canManageProjects}
          />
        </div>

        {/* Activity Log */}
        <div className="bg-white dark:bg-neutral-900/80 rounded-xl shadow-card border border-neutral-200 dark:border-primary-800/30 p-6 transition-colors duration-300">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Activity Log</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 text-sm">
              <div className="w-2 h-2 bg-primary-500 dark:bg-primary-400 rounded-full mt-2"></div>
              <div>
                <p className="text-neutral-900 dark:text-white">Project created by {project.createdBy?.name}</p>
                <p className="text-neutral-500 dark:text-primary-400">{formatDate(project.createdAt)}</p>
              </div>
            </div>
            {project.lastUpdatedBy && (
              <div className="flex items-start space-x-3 text-sm">
                <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full mt-2"></div>
                <div>
                  <p className="text-neutral-900 dark:text-white">Last updated by {project.lastUpdatedBy?.name}</p>
                  <p className="text-neutral-500 dark:text-primary-400">{formatDate(project.updatedAt)}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* File Upload Modal */}
      <FileUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        projectId={id}
        onSuccess={handleFileUploadSuccess}
      />
    </Layout>
  );
};

export default SingleProjectPage;
