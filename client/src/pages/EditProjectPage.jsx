import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Layout from '../components/Layout';
import { getProjectById, updateProject } from '../redux/projectSlice';
import { FiSave, FiX, FiArrowLeft } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const EditProjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { project, isLoading } = useSelector((state) => state.projects);
  const { user } = useSelector((state) => state.auth);
  
  const [agencies, setAgencies] = useState([]);
  const [loadingAgencies, setLoadingAgencies] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    component: '',
    state: '',
    district: '',
    implementingAgency: '',
    executingAgency: '',
    status: 'Sanctioned',
    totalBudget: '',
    fundReleased: '',
    fundUtilized: '',
    sanctionDate: '',
    expectedCompletion: '',
  });

  const [errors, setErrors] = useState({});

  // Fetch project and agencies on mount
  useEffect(() => {
    dispatch(getProjectById(id));
  }, [dispatch, id]);

  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        const token = user?.token;
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get(`${API_URL}/agencies`, config);
        setAgencies(response.data);
        setLoadingAgencies(false);
      } catch (error) {
        console.error('Failed to fetch agencies:', error);
        setLoadingAgencies(false);
      }
    };

    if (user?.token) {
      fetchAgencies();
    }
  }, [user]);

  // Populate form when project loads
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        component: project.component || '',
        state: project.state || '',
        district: project.district || '',
        implementingAgency: project.implementingAgency?._id || '',
        executingAgency: project.executingAgency?._id || '',
        status: project.status || 'Sanctioned',
        totalBudget: project.financials?.totalBudget || '',
        fundReleased: project.financials?.fundsReleased || '',
        fundUtilized: project.financials?.fundsUtilized || '',
        sanctionDate: project.sanctionDate ? project.sanctionDate.split('T')[0] : '',
        expectedCompletion: project.expectedCompletionDate ? project.expectedCompletionDate.split('T')[0] : '',
      });
    }
  }, [project]);

  const components = [
    'Adarsh Gram',
    'GIA',
    'Hostel',
  ];

  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  ];

  const districtsByState = {
    'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Rajahmundry', 'Tirupati', 'Kadapa'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur'],
    // Add more as needed (same as NewProjectPage)
  };

  const statuses = ['Sanctioned', 'In-Progress', 'Completed', 'Delayed'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'state') {
      setFormData((prev) => ({
        ...prev,
        state: value,
        district: '',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Project title is required';
    if (!formData.component) newErrors.component = 'Component is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.district) newErrors.district = 'District is required';
    if (!formData.implementingAgency) newErrors.implementingAgency = 'Implementing agency is required';
    if (!formData.executingAgency) newErrors.executingAgency = 'Executing agency is required';
    if (!formData.totalBudget || formData.totalBudget <= 0) newErrors.totalBudget = 'Valid budget is required';
    if (!formData.sanctionDate) newErrors.sanctionDate = 'Sanction date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    try {
      const projectPayload = {
        title: formData.title,
        description: formData.description,
        component: formData.component,
        state: formData.state,
        district: formData.district,
        implementingAgency: formData.implementingAgency,
        executingAgency: formData.executingAgency,
        status: formData.status,
        financials: {
          totalBudget: parseFloat(formData.totalBudget),
          fundsReleased: parseFloat(formData.fundReleased) || 0,
          fundsUtilized: parseFloat(formData.fundUtilized) || 0,
        },
        sanctionDate: formData.sanctionDate,
        expectedCompletionDate: formData.expectedCompletion || undefined,
      };

      await dispatch(updateProject({ id, projectData: projectPayload })).unwrap();
      
      alert('Project updated successfully!');
      navigate(`/projects/${id}`);
    } catch (error) {
      console.error('Failed to update project:', error);
      alert(`Failed to update project: ${error}`);
    }
  };

  const handleCancel = () => {
    navigate(`/projects/${id}`);
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
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(`/projects/${id}`)}
            className="p-2 hover:bg-secondary-100 dark:hover:bg-primary-900/40 rounded-lg transition-colors text-neutral-700 dark:text-primary-200"
          >
            <FiArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Edit Project</h1>
            <p className="text-neutral-600 dark:text-primary-300 mt-1">
              Update project information
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-900/80 rounded-2xl shadow-card border border-neutral-200 dark:border-primary-800/30 p-6 transition-colors duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Project Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-neutral-700 dark:text-primary-200 mb-2">
                Project Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors bg-white dark:bg-primary-900/30 text-neutral-900 dark:text-white border-neutral-300 dark:border-primary-700 placeholder-neutral-400 dark:placeholder-primary-400 ${
                  errors.title ? 'border-red-500' : ''
                }`}
                placeholder="Enter project title"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-neutral-700 dark:text-primary-200 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors bg-white dark:bg-primary-900/30 text-neutral-900 dark:text-white border-neutral-300 dark:border-primary-700 placeholder-neutral-400 dark:placeholder-primary-400"
                placeholder="Enter project description"
              />
            </div>

            {/* Component */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-primary-200 mb-2">
                Component <span className="text-red-500">*</span>
              </label>
              <select
                name="component"
                value={formData.component}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors bg-white dark:bg-primary-900/30 text-neutral-900 dark:text-white border-neutral-300 dark:border-primary-700 ${
                  errors.component ? 'border-red-500' : ''
                }`}
              >
                <option value="">Select Component</option>
                {components.map((comp) => (
                  <option key={comp} value={comp}>
                    {comp}
                  </option>
                ))}
              </select>
              {errors.component && <p className="text-red-500 text-sm mt-1">{errors.component}</p>}
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-primary-200 mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors bg-white dark:bg-primary-900/30 text-neutral-900 dark:text-white border-neutral-300 dark:border-primary-700 ${
                  errors.state ? 'border-red-500' : ''
                }`}
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
            </div>

            {/* District */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-primary-200 mb-2">
                District <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors bg-white dark:bg-primary-900/30 text-neutral-900 dark:text-white border-neutral-300 dark:border-primary-700 placeholder-neutral-400 dark:placeholder-primary-400 ${
                  errors.district ? 'border-red-500' : ''
                }`}
                placeholder="Enter district"
              />
              {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
            </div>

            {/* Implementing Agency */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-primary-200 mb-2">
                Implementing Agency <span className="text-red-500">*</span>
              </label>
              <select
                name="implementingAgency"
                value={formData.implementingAgency}
                onChange={handleChange}
                disabled={loadingAgencies}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors bg-white dark:bg-primary-900/30 text-neutral-900 dark:text-white border-neutral-300 dark:border-primary-700 disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.implementingAgency ? 'border-red-500' : ''
                }`}
              >
                <option value="">{loadingAgencies ? 'Loading agencies...' : 'Select Implementing Agency'}</option>
                {agencies.map((agency) => (
                  <option key={agency._id} value={agency._id}>
                    {agency.name} ({agency.type})
                  </option>
                ))}
              </select>
              {errors.implementingAgency && <p className="text-red-500 text-sm mt-1">{errors.implementingAgency}</p>}
            </div>

            {/* Executing Agency */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-primary-200 mb-2">
                Executing Agency <span className="text-red-500">*</span>
              </label>
              <select
                name="executingAgency"
                value={formData.executingAgency}
                onChange={handleChange}
                disabled={loadingAgencies}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors bg-white dark:bg-primary-900/30 text-neutral-900 dark:text-white border-neutral-300 dark:border-primary-700 disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.executingAgency ? 'border-red-500' : ''
                }`}
              >
                <option value="">{loadingAgencies ? 'Loading agencies...' : 'Select Executing Agency'}</option>
                {agencies.map((agency) => (
                  <option key={agency._id} value={agency._id}>
                    {agency.name} ({agency.type})
                  </option>
                ))}
              </select>
              {errors.executingAgency && <p className="text-red-500 text-sm mt-1">{errors.executingAgency}</p>}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-primary-200 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors bg-white dark:bg-primary-900/30 text-neutral-900 dark:text-white border-neutral-300 dark:border-primary-700"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Total Budget */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-primary-200 mb-2">
                Total Budget (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="totalBudget"
                value={formData.totalBudget}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors bg-white dark:bg-primary-900/30 text-neutral-900 dark:text-white border-neutral-300 dark:border-primary-700 placeholder-neutral-400 dark:placeholder-primary-400 ${
                  errors.totalBudget ? 'border-red-500' : ''
                }`}
                placeholder="Enter total budget"
                min="0"
              />
              {errors.totalBudget && <p className="text-red-500 text-sm mt-1">{errors.totalBudget}</p>}
            </div>

            {/* Fund Released */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-primary-200 mb-2">
                Fund Released (₹)
              </label>
              <input
                type="number"
                name="fundReleased"
                value={formData.fundReleased}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors bg-white dark:bg-primary-900/30 text-neutral-900 dark:text-white border-neutral-300 dark:border-primary-700 placeholder-neutral-400 dark:placeholder-primary-400"
                placeholder="Enter fund released"
                min="0"
              />
            </div>

            {/* Fund Utilized */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-primary-200 mb-2">
                Fund Utilized (₹)
              </label>
              <input
                type="number"
                name="fundUtilized"
                value={formData.fundUtilized}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors bg-white dark:bg-primary-900/30 text-neutral-900 dark:text-white border-neutral-300 dark:border-primary-700 placeholder-neutral-400 dark:placeholder-primary-400"
                placeholder="Enter fund utilized"
                min="0"
              />
            </div>

            {/* Sanction Date */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-primary-200 mb-2">
                Sanction Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="sanctionDate"
                value={formData.sanctionDate}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors bg-white dark:bg-primary-900/30 text-neutral-900 dark:text-white border-neutral-300 dark:border-primary-700 ${
                  errors.sanctionDate ? 'border-red-500' : ''
                }`}
              />
              {errors.sanctionDate && <p className="text-red-500 text-sm mt-1">{errors.sanctionDate}</p>}
            </div>

            {/* Expected Completion */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-primary-200 mb-2">
                Expected Completion Date
              </label>
              <input
                type="date"
                name="expectedCompletion"
                value={formData.expectedCompletion}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors bg-white dark:bg-primary-900/30 text-neutral-900 dark:text-white border-neutral-300 dark:border-primary-700"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-neutral-200 dark:border-primary-800/30">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="flex items-center space-x-2 px-6 py-2.5 bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiX size={18} />
              <span>Cancel</span>
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center space-x-2 px-6 py-2.5 bg-primary-600 dark:bg-primary-700 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <FiSave size={18} />
                  <span>Update Project</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditProjectPage;
