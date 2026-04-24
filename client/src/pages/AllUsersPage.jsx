import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Layout from '../components/Layout';
import {
  FiSearch,
  FiFilter,
  FiUserCheck,
  FiUserX,
  FiEdit2,
  FiTrash2,
  FiRefreshCw,
  FiMail,
  FiMapPin,
  FiCheckCircle,
  FiAlertCircle,
  FiX,
} from 'react-icons/fi';

const AllUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Modal states
  const [showRejectModal, setShowRejectModal] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [showEditModal, setShowEditModal] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const API_URL = process.env.REACT_APP_API_URL || '/api';

  useEffect(() => {
    // Only admins can access this page
    if (user && user.role !== 'MoSJE-Admin') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      
      const response = await axios.get(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setUsers(response.data);
      setFilteredUsers(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter users based on search and filters
  useEffect(() => {
    let result = users;

    // Search filter
    if (searchTerm) {
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter) {
      result = result.filter((u) => u.role === roleFilter);
    }

    // Status filter
    if (statusFilter === 'active') {
      result = result.filter((u) => u.isActive === true);
    } else if (statusFilter === 'pending') {
      result = result.filter((u) => u.isActive === false);
    }

    setFilteredUsers(result);
  }, [searchTerm, roleFilter, statusFilter, users]);

  const handleApprove = async (userId) => {
    if (!window.confirm('Are you sure you want to approve this user? They will receive an email notification.')) {
      return;
    }

    try {
      setProcessingId(userId);
      const token = JSON.parse(localStorage.getItem('user'))?.token;

      await axios.put(
        `${API_URL}/users/${userId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('User approved successfully! Approval email sent.');
      fetchAllUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve user');
      console.error('Error approving user:', err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectClick = (userId) => {
    setShowRejectModal(userId);
    setRejectionReason('');
  };

  const handleRejectConfirm = async () => {
    const userId = showRejectModal;
    
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      setProcessingId(userId);
      const token = JSON.parse(localStorage.getItem('user'))?.token;

      await axios.delete(`${API_URL}/users/${userId}/reject`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          reason: rejectionReason,
        },
      });

      alert('User registration rejected. Notification email sent.');
      setShowRejectModal(null);
      fetchAllUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject user');
      console.error('Error rejecting user:', err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteClick = (userToDelete) => {
    setShowDeleteModal(userToDelete);
  };

  const handleDeleteConfirm = async () => {
    const userId = showDeleteModal._id;

    try {
      setProcessingId(userId);
      const token = JSON.parse(localStorage.getItem('user'))?.token;

      await axios.delete(`${API_URL}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('User deleted successfully');
      setShowDeleteModal(null);
      fetchAllUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
      console.error('Error deleting user:', err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleEditClick = (userToEdit) => {
    setShowEditModal(userToEdit);
    setEditFormData({
      name: userToEdit.name,
      email: userToEdit.email,
      role: userToEdit.role,
      isActive: userToEdit.isActive,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const userId = showEditModal._id;

    try {
      setProcessingId(userId);
      const token = JSON.parse(localStorage.getItem('user'))?.token;

      await axios.put(
        `${API_URL}/users/${userId}`,
        editFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('User updated successfully');
      setShowEditModal(null);
      fetchAllUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user');
      console.error('Error updating user:', err);
    } finally {
      setProcessingId(null);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'MoSJE-Admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'State-Admin':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Agency-User':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getStats = () => {
    return {
      total: users.length,
      active: users.filter((u) => u.isActive).length,
      pending: users.filter((u) => !u.isActive).length,
      admins: users.filter((u) => u.role === 'MoSJE-Admin').length,
      stateAdmins: users.filter((u) => u.role === 'State-Admin').length,
      agencyUsers: users.filter((u) => u.role === 'Agency-User').length,
    };
  };

  const stats = getStats();

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-neutral-800 dark:text-white">
              All Users Management
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              View, verify, edit, and manage all system users
            </p>
          </div>
          <button
            onClick={fetchAllUsers}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Users</p>
            <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{stats.total}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">Active</p>
            <p className="text-3xl font-bold text-green-700 dark:text-green-300">{stats.active}</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">Pending</p>
            <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">{stats.pending}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Admins</p>
            <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">{stats.admins}</p>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
            <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">State Admins</p>
            <p className="text-3xl font-bold text-indigo-700 dark:text-indigo-300">{stats.stateAdmins}</p>
          </div>
          <div className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 p-4 rounded-lg border border-teal-200 dark:border-teal-800">
            <p className="text-sm text-teal-600 dark:text-teal-400 font-medium">Agency Users</p>
            <p className="text-3xl font-bold text-teal-700 dark:text-teal-300">{stats.agencyUsers}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
              />
            </div>

            {/* Role Filter */}
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white appearance-none"
              >
                <option value="">All Roles</option>
                <option value="MoSJE-Admin">MoSJE Admin</option>
                <option value="State-Admin">State Admin</option>
                <option value="Agency-User">Agency User</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white appearance-none"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending Approval</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <FiAlertCircle className="mx-auto text-6xl text-neutral-400 mb-4" />
              <p className="text-xl text-neutral-600 dark:text-neutral-400">
                {searchTerm || roleFilter || statusFilter
                  ? 'No users match your filters'
                  : 'No users found'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
                <thead className="bg-neutral-50 dark:bg-neutral-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
                  {filteredUsers.map((userData) => (
                    <tr key={userData._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold">
                              {userData.name.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-neutral-900 dark:text-white">
                              {userData.name}
                            </div>
                            <div className="text-sm text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                              <FiMail className="text-xs" />
                              {userData.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(userData.role)}`}>
                          {userData.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {userData.isActive ? (
                          <span className="px-3 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                            <FiCheckCircle />
                            Active
                          </span>
                        ) : (
                          <span className="px-3 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                            <FiAlertCircle />
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">
                          {userData.state && (
                            <div className="flex items-center gap-1">
                              <FiMapPin className="text-xs" />
                              {userData.state}
                            </div>
                          )}
                          {userData.agency?.name && (
                            <div className="text-xs text-neutral-500 dark:text-neutral-500">
                              {userData.agency.name}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          {!userData.isActive && (
                            <>
                              <button
                                onClick={() => handleApprove(userData._id)}
                                disabled={processingId === userData._id}
                                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50"
                                title="Approve User"
                              >
                                <FiUserCheck className="text-xl" />
                              </button>
                              <button
                                onClick={() => handleRejectClick(userData._id)}
                                disabled={processingId === userData._id}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                                title="Reject User"
                              >
                                <FiUserX className="text-xl" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleEditClick(userData)}
                            disabled={processingId === userData._id}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50"
                            title="Edit User"
                          >
                            <FiEdit2 className="text-lg" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(userData)}
                            disabled={processingId === userData._id || userData._id === user?._id}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                            title={userData._id === user?._id ? "Can't delete yourself" : "Delete User"}
                          >
                            <FiTrash2 className="text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                Reject User Registration
              </h3>
              <button
                onClick={() => setShowRejectModal(null)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
              >
                <FiX className="text-2xl" />
              </button>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Please provide a reason for rejecting this user registration. The user will receive an email with this reason.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows="4"
              className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowRejectModal(null)}
                className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                disabled={!rejectionReason.trim() || processingId}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {processingId ? 'Processing...' : 'Reject User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                Delete User
              </h3>
              <button
                onClick={() => setShowDeleteModal(null)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
              >
                <FiX className="text-2xl" />
              </button>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Are you sure you want to delete user <strong>{showDeleteModal.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={processingId}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {processingId ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                Edit User
              </h3>
              <button
                onClick={() => setShowEditModal(null)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
              >
                <FiX className="text-2xl" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Role
                </label>
                <select
                  value={editFormData.role}
                  onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
                  required
                >
                  <option value="Agency-User">Agency User</option>
                  <option value="State-Admin">State Admin</option>
                  <option value="MoSJE-Admin">MoSJE Admin</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={editFormData.isActive}
                  onChange={(e) => setEditFormData({ ...editFormData, isActive: e.target.checked })}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                />
                <label className="ml-2 block text-sm text-neutral-700 dark:text-neutral-300">
                  Active
                </label>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(null)}
                  className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processingId}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  {processingId ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AllUsersPage;
