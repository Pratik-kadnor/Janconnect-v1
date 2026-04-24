import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Layout from '../components/Layout';

const PendingUsersPage = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(null);

  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const API_URL = process.env.REACT_APP_API_URL || '/api';

  useEffect(() => {
    // Only admins can access this page
    if (user && user.role !== 'MoSJE-Admin') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      
      const response = await axios.get(`${API_URL}/users?isActive=false`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setPendingUsers(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch pending users');
      console.error('Error fetching pending users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      fetchPendingUsers(); // Refresh list
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
      fetchPendingUsers(); // Refresh list
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject user');
      console.error('Error rejecting user:', err);
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
              Pending User Approvals
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              Review and approve user registrations
            </p>
          </div>
          <button
            onClick={fetchPendingUsers}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-6 text-white">
          <div className="flex items-center gap-3">
            <span className="text-5xl">⏳</span>
            <div>
              <p className="text-white/80 text-sm">Pending Approvals</p>
              <p className="text-4xl font-bold">{pendingUsers.length}</p>
            </div>
          </div>
        </div>

        {/* Pending Users List */}
        {pendingUsers.length === 0 ? (
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-card p-12 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-semibold text-neutral-800 dark:text-white mb-2">
              No Pending Approvals
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              All user registrations have been reviewed.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {pendingUsers.map((pendingUser) => (
              <div
                key={pendingUser._id}
                className="bg-white dark:bg-neutral-800 rounded-lg shadow-card p-6 hover:shadow-hover transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xl font-bold">
                        {pendingUser.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-neutral-800 dark:text-white">
                          {pendingUser.name}
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {pendingUser.email}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                          Role
                        </p>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                            pendingUser.role
                          )}`}
                        >
                          {pendingUser.role}
                        </span>
                      </div>

                      {pendingUser.state && (
                        <div>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                            State
                          </p>
                          <p className="text-sm font-medium text-neutral-800 dark:text-white">
                            📍 {pendingUser.state}
                          </p>
                        </div>
                      )}

                      {pendingUser.agency && (
                        <div>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                            Agency
                          </p>
                          <p className="text-sm font-medium text-neutral-800 dark:text-white">
                            🏢 {pendingUser.agency.name || pendingUser.agency}
                          </p>
                        </div>
                      )}

                      <div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                          Registered
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-300">
                          {new Date(pendingUser.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => handleApprove(pendingUser._id)}
                      disabled={processingId === pendingUser._id}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                    >
                      {processingId === pendingUser._id ? (
                        <>
                          <span className="animate-spin">⏳</span>
                          Processing...
                        </>
                      ) : (
                        <>
                          ✅ Approve
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleRejectClick(pendingUser._id)}
                      disabled={processingId === pendingUser._id}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                    >
                      ❌ Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-neutral-800 dark:text-white mb-4">
              Reject User Registration
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Please provide a reason for rejection. This will be sent to the user via email.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter reason for rejection..."
              className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white mb-4"
              rows="4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectModal(null)}
                className="flex-1 px-4 py-2 bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-white rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                disabled={!rejectionReason.trim()}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default PendingUsersPage;
