import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Agency-User',
    agency: '',
    state: '',
  });

  const [agencies, setAgencies] = useState([]);
  const [loadingAgencies, setLoadingAgencies] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const { name, email, password, confirmPassword, role, agency, state } = formData;

  const API_URL = process.env.REACT_APP_API_URL || '/api';
  
  console.log('API_URL:', API_URL);
  console.log('Environment:', process.env.REACT_APP_API_URL);

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  // Fetch agencies when component mounts
  useEffect(() => {
    const fetchAgencies = async () => {
      setLoadingAgencies(true);
      try {
        console.log('Fetching agencies from:', `${API_URL}/agencies/public`);
        const response = await axios.get(`${API_URL}/agencies/public`);
        console.log('Agencies response:', response.data);
        console.log('Number of agencies:', response.data.length);
        setAgencies(response.data);
      } catch (error) {
        console.error('Error fetching agencies:', error);
        console.error('Error details:', error.response?.data || error.message);
      } finally {
        setLoadingAgencies(false);
      }
    };

    fetchAgencies();
  }, [API_URL]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    // Clear error for this field when user starts typing
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';
    if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!role) newErrors.role = 'Role is required';
    if (role === 'Agency-User' && !agency) newErrors.agency = 'Agency is required for Agency User';
    if (role === 'State-Admin' && !state) newErrors.state = 'State is required for State Admin';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      // Prepare user data
      const userData = {
        name,
        email,
        password,
        role,
      };

      // Add role-specific fields
      if (role === 'Agency-User') {
        userData.agency = agency;
      }
      if (role === 'State-Admin') {
        userData.state = state;
      }

      // Register user (public endpoint)
      await axios.post(`${API_URL}/users/register-public`, userData);

      alert('Registration successful! Please wait for admin approval.');
      navigate('/login');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-neutral-900 via-primary-900 to-primary-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden cursor-pointer"
      onClick={(e) => {
        // Only navigate if clicking the background (not the form)
        if (e.target === e.currentTarget) {
          navigate('/');
        }
      }}
    >
      {/* Homepage Background with Dimmed Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Background Image from Landing Page */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/assets/background.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        ></div>
        
        {/* Dimmed Overlay for better signup form visibility */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/95 via-neutral-900/95 to-primary-800/95 backdrop-blur-sm"></div>
      </div>
      
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-400/10 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="max-w-2xl w-full relative z-10 animate-fade-in">
        {/* Enhanced Glassmorphic Card */}
        <div 
          className="backdrop-blur-2xl bg-neutral-900/40 rounded-3xl shadow-2xl border border-white/10 p-8 sm:p-10 hover:shadow-hover transition-all duration-300 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()} // Prevent click from bubbling to background
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div 
              className="mx-auto w-24 h-24 bg-black rounded-2xl flex items-center justify-center mb-4 shadow-2xl border-2 border-primary-500/30 p-2 hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => navigate('/')}
              title="Go to Homepage"
            >
              <img src="./assets/logo.png" alt="JanConnect Logo" className="w-full h-full object-contain drop-shadow-2xl" />
            </div>
            <h2 
              className="text-3xl font-heading font-bold text-white mb-2 tracking-tight cursor-pointer hover:text-primary-300 transition-colors"
              onClick={() => navigate('/')}
              title="Go to Homepage"
            >
              Create Account
            </h2>
            <p className="text-sm text-primary-200 font-medium">
              Join JanConnect Portal
            </p>
          </div>

          {/* Signup Form */}
          <div className="space-y-5">
            <form onSubmit={onSubmit} className="space-y-5">
              {/* Name */}
              <div className="space-y-1">
                <label htmlFor="name" className="block text-sm font-medium text-neutral-200">
                  Full Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={onChange}
                  className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border ${errors.name ? 'border-red-500' : 'border-white/20'} rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:bg-white/15`}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-medium text-neutral-200">
                  Email Address *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={onChange}
                  className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border ${errors.email ? 'border-red-500' : 'border-white/20'} rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:bg-white/15`}
                  placeholder="Enter your email address"
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Role */}
              <div className="space-y-1">
                <label htmlFor="role" className="block text-sm font-medium text-neutral-200">
                  User Role *
                </label>
                <select
                  id="role"
                  name="role"
                  value={role}
                  onChange={onChange}
                  className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border ${errors.role ? 'border-red-500' : 'border-white/20'} rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:bg-white/15`}
                >
                  <option value="Agency-User" className="bg-neutral-800">Agency User</option>
                  <option value="State-Admin" className="bg-neutral-800">State Admin</option>
                  <option value="MoSJE-Admin" className="bg-neutral-800">MoSJE Admin</option>
                </select>
                {errors.role && <p className="text-red-400 text-xs mt-1">{errors.role}</p>}
              </div>

              {/* Agency (conditional) */}
              {role === 'Agency-User' && (
                <div className="space-y-1">
                  <label htmlFor="agency" className="block text-sm font-medium text-neutral-200">
                    Select Agency *
                  </label>
                  <select
                    id="agency"
                    name="agency"
                    value={agency}
                    onChange={onChange}
                    className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border ${errors.agency ? 'border-red-500' : 'border-white/20'} rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:bg-white/15`}
                    disabled={loadingAgencies}
                  >
                    <option value="" className="bg-neutral-800">Select an agency...</option>
                    {agencies.map((ag) => (
                      <option key={ag._id} value={ag._id} className="bg-neutral-800">
                        {ag.name}
                      </option>
                    ))}
                  </select>
                  {errors.agency && <p className="text-red-400 text-xs mt-1">{errors.agency}</p>}
                </div>
              )}

              {/* State (conditional) */}
              {role === 'State-Admin' && (
                <div className="space-y-1">
                  <label htmlFor="state" className="block text-sm font-medium text-neutral-200">
                    Select State *
                  </label>
                  <select
                    id="state"
                    name="state"
                    value={state}
                    onChange={onChange}
                    className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border ${errors.state ? 'border-red-500' : 'border-white/20'} rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:bg-white/15`}
                  >
                    <option value="" className="bg-neutral-800">Select a state...</option>
                    {indianStates.map((st) => (
                      <option key={st} value={st} className="bg-neutral-800">
                        {st}
                      </option>
                    ))}
                  </select>
                  {errors.state && <p className="text-red-400 text-xs mt-1">{errors.state}</p>}
                </div>
              )}

              {/* Password */}
              <div className="space-y-1">
                <label htmlFor="password" className="block text-sm font-medium text-neutral-200">
                  Password *
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={onChange}
                  className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border ${errors.password ? 'border-red-500' : 'border-white/20'} rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:bg-white/15`}
                  placeholder="Create a password (min 6 characters)"
                />
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-200">
                  Confirm Password *
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={onChange}
                  className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border ${errors.confirmPassword ? 'border-red-500' : 'border-white/20'} rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:bg-white/15`}
                  placeholder="Re-enter your password"
                />
                {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3.5 px-6 rounded-xl font-semibold text-base hover:from-primary-600 hover:to-primary-700 hover:scale-[1.02] hover:shadow-hover focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 disabled:from-neutral-600 disabled:to-neutral-700 disabled:cursor-not-allowed disabled:scale-100 shadow-card"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : 'Create Account'}
              </button>
            </form>

            {/* Login Link */}
            <div className="text-center mt-6">
              <p className="text-sm text-neutral-300">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="font-semibold text-primary-400 hover:text-primary-300 transition-colors duration-200"
                >
                  Sign in here
                </Link>
              </p>
            </div>

            {/* Back to Homepage Link */}
            <div className="text-center mt-4">
              <p className="text-xs text-neutral-400">
                <Link 
                  to="/" 
                  className="hover:text-primary-300 transition-colors duration-200 flex items-center justify-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Homepage
                </Link>
              </p>
            </div>

            {/* Info Note */}
            <div className="mt-6 p-4 bg-gradient-to-br from-blue-900/30 to-blue-800/30 backdrop-blur-sm rounded-xl border border-blue-600/30">
              <p className="text-xs text-blue-200 flex items-start">
                <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>Your account will be created but inactive until approved by an administrator. You will be notified once your account is activated.</span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-neutral-400 font-body">
          © {new Date().getFullYear()} Ministry of Social Justice & Empowerment. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
