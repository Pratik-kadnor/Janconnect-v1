import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAgencies,
  createAgency,
  updateAgency,
  deleteAgency,
  reset,
} from '../redux/agencySlice';
import Layout from '../components/Layout';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiMapPin,
  FiUser,
  FiMail,
  FiPhone,
  FiCheckCircle,
  FiXCircle,
  FiX,
  FiSave,
  FiHome,
} from 'react-icons/fi';
import { INDIAN_STATES } from '../utils/helpers';

const AgenciesPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { agencies, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.agencies
  );

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterState, setFilterState] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [agencyToDelete, setAgencyToDelete] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: 'Implementing',
    state: '',
    district: '',
    nodalOfficer: {
      name: '',
      email: '',
      phone: '',
    },
    address: '',
    isActive: true,
  });

  // Check permissions
  const canManageAgencies = user?.role === 'MoSJE-Admin' || user?.role === 'State-Admin';

  // Fetch agencies on mount
  useEffect(() => {
    const filters = {};
    if (filterType) filters.type = filterType;
    if (filterState) filters.state = filterState;
    if (filterStatus) filters.isActive = filterStatus === 'active';

    dispatch(getAgencies(filters));
  }, [dispatch, filterType, filterState, filterStatus]);

  // Handle success/error messages
  useEffect(() => {
    if (isError) {
      alert(message);
      dispatch(reset());
    }

    if (isSuccess && message) {
      if (message.includes('successfully')) {
        setShowModal(false);
        resetForm();
        dispatch(reset());
      }
    }
  }, [isError, isSuccess, message, dispatch]);

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      type: 'Implementing',
      state: '',
      district: '',
      nodalOfficer: {
        name: '',
        email: '',
        phone: '',
      },
      address: '',
      isActive: true,
    });
    setSelectedAgency(null);
    setIsEditMode(false);
  };

  // Open create modal
  const handleCreateClick = () => {
    resetForm();
    setShowModal(true);
  };

  // Open edit modal
  const handleEditClick = (agency) => {
    setSelectedAgency(agency);
    setFormData({
      name: agency.name,
      type: agency.type,
      state: agency.state,
      district: agency.district || '',
      nodalOfficer: {
        name: agency.nodalOfficer.name,
        email: agency.nodalOfficer.email,
        phone: agency.nodalOfficer.phone,
      },
      address: agency.address || '',
      isActive: agency.isActive,
    });
    setIsEditMode(true);
    setShowModal(true);
  };

  // Handle delete
  const handleDeleteClick = (agency) => {
    setAgencyToDelete(agency);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (agencyToDelete) {
      dispatch(deleteAgency(agencyToDelete._id));
      setShowDeleteConfirm(false);
      setAgencyToDelete(null);
    }
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditMode && selectedAgency) {
      dispatch(updateAgency({ id: selectedAgency._id, agencyData: formData }));
    } else {
      dispatch(createAgency(formData));
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('nodalOfficer.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        nodalOfficer: {
          ...formData.nodalOfficer,
          [field]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  // Filter agencies
  const filteredAgencies = agencies.filter((agency) => {
    const matchesSearch = agency.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Get stats
  const stats = {
    total: agencies.length,
    implementing: agencies.filter((a) => a.type === 'Implementing').length,
    executing: agencies.filter((a) => a.type === 'Executing').length,
    active: agencies.filter((a) => a.isActive).length,
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Agencies Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage implementing and executing agencies
              </p>
            </div>
            {canManageAgencies && (
              <button
                onClick={handleCreateClick}
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <FiPlus className="mr-2" />
                Add Agency
              </button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Agencies</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
              <FiHome className="text-3xl text-blue-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Implementing</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.implementing}</p>
              </div>
              <FiCheckCircle className="text-3xl text-green-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Executing</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.executing}</p>
              </div>
              <FiCheckCircle className="text-3xl text-purple-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.active}</p>
              </div>
              <FiCheckCircle className="text-3xl text-emerald-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search agencies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Types</option>
              <option value="Implementing">Implementing</option>
              <option value="Executing">Executing</option>
            </select>

            {/* State Filter */}
            <select
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All States</option>
              {INDIAN_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Agencies List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredAgencies.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
            <FiHome className="mx-auto text-6xl text-gray-400 mb-4" />
            <p className="text-xl text-gray-600 dark:text-gray-400">No agencies found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAgencies.map((agency) => (
              <div
                key={agency._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {agency.name}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            agency.type === 'Implementing'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                              : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                          }`}
                        >
                          {agency.type}
                        </span>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            agency.isActive
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                          }`}
                        >
                          {agency.isActive ? (
                            <>
                              <FiCheckCircle className="mr-1" /> Active
                            </>
                          ) : (
                            <>
                              <FiXCircle className="mr-1" /> Inactive
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                    {canManageAgencies && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(agency)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                        >
                          <FiEdit2 />
                        </button>
                        {user?.role === 'MoSJE-Admin' && (
                          <button
                            onClick={() => handleDeleteClick(agency)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                          >
                            <FiTrash2 />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Location */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <FiMapPin className="mr-2 flex-shrink-0" />
                      <span>
                        {agency.district ? `${agency.district}, ` : ''}
                        {agency.state}
                      </span>
                    </div>
                    {agency.address && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">
                        {agency.address}
                      </p>
                    )}
                  </div>

                  {/* Nodal Officer */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nodal Officer
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <FiUser className="mr-2 flex-shrink-0" />
                        <span>{agency.nodalOfficer.name}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <FiMail className="mr-2 flex-shrink-0" />
                        <a
                          href={`mailto:${agency.nodalOfficer.email}`}
                          className="hover:text-primary-600"
                        >
                          {agency.nodalOfficer.email}
                        </a>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <FiPhone className="mr-2 flex-shrink-0" />
                        <a
                          href={`tel:${agency.nodalOfficer.phone}`}
                          className="hover:text-primary-600"
                        >
                          {agency.nodalOfficer.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {isEditMode ? 'Edit Agency' : 'Create New Agency'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FiX className="text-2xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Agency Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Agency Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter agency name"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Agency Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="Implementing">Implementing</option>
                  <option value="Executing">Executing</option>
                </select>
              </div>

              {/* State and District */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    State *
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select State</option>
                    {INDIAN_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    District
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter district"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter full address"
                />
              </div>

              {/* Nodal Officer Details */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Nodal Officer Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="nodalOfficer.name"
                      value={formData.nodalOfficer.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter name"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="nodalOfficer.email"
                        value={formData.nodalOfficer.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Enter email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="nodalOfficer.phone"
                        value={formData.nodalOfficer.phone}
                        onChange={handleChange}
                        required
                        pattern="[0-9]{10}"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                        placeholder="10-digit phone number"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Active
                </label>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  <FiSave className="mr-2" />
                  {isLoading ? 'Saving...' : isEditMode ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && agencyToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete <strong>{agencyToDelete.name}</strong>? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setAgencyToDelete(null);
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AgenciesPage;
