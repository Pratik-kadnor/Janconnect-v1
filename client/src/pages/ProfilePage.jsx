import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import Layout from '../components/Layout';
import { setCredentials } from '../redux/authSlice';
import { FiUser, FiMail, FiMapPin, FiEdit2, FiSave, FiX, FiBriefcase, FiShield } from 'react-icons/fi';

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const API_URL = process.env.REACT_APP_API_URL || '/api';

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [agencyDetails, setAgencyDetails] = useState(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Fetch agency details if user is an Agency-User
  useEffect(() => {
    const fetchAgencyDetails = async () => {
      if (user?.role === 'Agency-User' && user?.agency) {
        try {
          const token = JSON.parse(localStorage.getItem('user'))?.token;
          const response = await axios.get(`${API_URL}/agencies/${user.agency}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setAgencyDetails(response.data);
        } catch (err) {
          console.error('Error fetching agency details:', err);
        }
      }
    };

    fetchAgencyDetails();
  }, [user, API_URL]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords if changing
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        setError('Current password is required to set a new password');
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setError('New passwords do not match');
        return;
      }
      if (formData.newPassword.length < 6) {
        setError('New password must be at least 6 characters');
        return;
      }
    }

    try {
      setLoading(true);
      setError('');
      const token = JSON.parse(localStorage.getItem('user'))?.token;

      const updateData = {
        name: formData.name,
        email: formData.email,
      };

      // Only include password fields if user wants to change password
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.password = formData.newPassword;
      }

      const response = await axios.put(
        `${API_URL}/users/me`,
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update Redux store and localStorage with new user data
      const updatedUser = { ...user, ...response.data };
      dispatch(setCredentials(updatedUser));
      
      const storedUser = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem('user', JSON.stringify({ ...storedUser, ...response.data }));

      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Clear password fields
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'MoSJE-Admin':
        return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700';
      case 'State-Admin':
        return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700';
      case 'Agency-User':
        return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700';
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700';
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-neutral-900 dark:text-white mb-2">
            My Profile
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            View and manage your account information
          </p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-400">
            {success}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-card border border-neutral-200 dark:border-neutral-700 overflow-hidden">
          {/* Header with Avatar */}
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-8">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-white dark:bg-neutral-800 rounded-full flex items-center justify-center shadow-lg">
                <FiUser className="text-primary-600 dark:text-primary-400" size={48} />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">{user?.name}</h2>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getRoleBadgeColor(user?.role)}`}>
                  <FiShield className="mr-1" size={14} />
                  {user?.role?.replace('-', ' ')}
                </span>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-white text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200 shadow-soft hover:shadow-card font-semibold"
                >
                  <FiEdit2 size={18} />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-6">
              {/* Personal Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      <FiUser className="mr-2" size={16} />
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 ${
                        isEditing
                          ? 'bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
                          : 'bg-neutral-50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-700 cursor-not-allowed'
                      } text-neutral-900 dark:text-white`}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      <FiMail className="mr-2" size={16} />
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 ${
                        isEditing
                          ? 'bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
                          : 'bg-neutral-50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-700 cursor-not-allowed'
                      } text-neutral-900 dark:text-white`}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Role Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                  Role Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* State (for State-Admin) */}
                  {user?.role === 'State-Admin' && user?.state && (
                    <div>
                      <label className="flex items-center text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        <FiMapPin className="mr-2" size={16} />
                        State
                      </label>
                      <input
                        type="text"
                        value={user.state}
                        disabled
                        className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50 rounded-xl text-neutral-900 dark:text-white cursor-not-allowed"
                      />
                    </div>
                  )}

                  {/* Agency (for Agency-User) */}
                  {user?.role === 'Agency-User' && agencyDetails && (
                    <>
                      <div>
                        <label className="flex items-center text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                          <FiBriefcase className="mr-2" size={16} />
                          Agency
                        </label>
                        <input
                          type="text"
                          value={agencyDetails.name}
                          disabled
                          className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50 rounded-xl text-neutral-900 dark:text-white cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="flex items-center text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                          <FiMapPin className="mr-2" size={16} />
                          State
                        </label>
                        <input
                          type="text"
                          value={agencyDetails.state}
                          disabled
                          className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50 rounded-xl text-neutral-900 dark:text-white cursor-not-allowed"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Change Password Section (only when editing) */}
              {isEditing && (
                <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                    Change Password (Optional)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 block">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-neutral-900 dark:text-white transition-all duration-200"
                        placeholder="Enter current password"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 block">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-neutral-900 dark:text-white transition-all duration-200"
                        placeholder="Enter new password"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 block">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-neutral-900 dark:text-white transition-all duration-200"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                    Leave password fields empty if you don't want to change your password
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex items-center space-x-2 px-6 py-3 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 rounded-xl transition-all duration-200 font-semibold"
                  >
                    <FiX size={18} />
                    <span>Cancel</span>
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-700 hover:to-secondary-700 rounded-xl transition-all duration-200 shadow-soft hover:shadow-card font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiSave size={18} />
                    <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Account Info */}
        <div className="mt-6 p-4 bg-neutral-100 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            <span className="font-semibold">Account Status:</span>{' '}
            {user?.isActive ? (
              <span className="text-green-600 dark:text-green-400">✓ Active</span>
            ) : (
              <span className="text-yellow-600 dark:text-yellow-400">⏳ Pending Approval</span>
            )}
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
