import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getProjects } from '../redux/projectSlice';
import Layout from '../components/Layout';
import ProjectTable from '../components/ProjectTable';
import { FiPlus } from 'react-icons/fi';
import { useRole } from '../hooks/useAuth';

const ProjectsListPage = () => {
  const dispatch = useDispatch();
  const { projects, isLoading } = useSelector((state) => state.projects);
  const { canManageProjects } = useRole();

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Projects</h1>
            <p className="text-neutral-600 dark:text-primary-300 mt-1">
              Manage and track all PM-AJAY scheme projects
            </p>
          </div>
          {canManageProjects && (
            <Link
              to="/projects/new"
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 dark:bg-primary-700 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors shadow-sm"
            >
              <FiPlus size={20} />
              <span>New Project</span>
            </Link>
          )}
        </div>

        {/* Projects Table */}
        <ProjectTable projects={projects} isLoading={isLoading} />
      </div>
    </Layout>
  );
};

export default ProjectsListPage;
