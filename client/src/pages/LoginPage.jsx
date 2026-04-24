import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, reset } from '../redux/authSlice';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      alert(message);
    }

    if (isSuccess || user) {
      navigate('/dashboard');
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    const userData = {
      email,
      password,
    };

    dispatch(login(userData));
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
        
        {/* Dimmed Overlay for better login form visibility */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/95 via-neutral-900/95 to-primary-800/95 backdrop-blur-sm"></div>
      </div>
      
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-400/10 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-primary-300/5 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-2xl w-full relative z-10 animate-fade-in">
        {/* Enhanced Glassmorphic Card */}
        <div 
          className="backdrop-blur-2xl bg-neutral-900/40 rounded-3xl shadow-2xl border border-white/10 p-10 sm:p-12 hover:shadow-hover transition-all duration-300"
          onClick={(e) => e.stopPropagation()} // Prevent click from bubbling to background
        >
          {/* Header */}
          <div className="text-center mb-10">
            <div 
              className="mx-auto w-28 h-28 bg-black rounded-2xl flex items-center justify-center mb-6 shadow-2xl border-2 border-primary-500/30 p-2 hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => navigate('/')}
              title="Go to Homepage"
            >
              <img src="./assets/logo.png" alt="JanConnect Logo" className="w-full h-full object-contain drop-shadow-2xl" />
            </div>
            <h2 
              className="text-4xl font-heading font-bold text-white mb-3 tracking-tight cursor-pointer hover:text-primary-300 transition-colors"
              onClick={() => navigate('/')}
              title="Go to Homepage"
            >
              JanConnect
            </h2>
            <p className="text-base text-primary-200 font-medium">
              PM-AJAY Scheme Management Portal
            </p>
            <p className="text-sm text-neutral-400 mt-2">
              Ministry of Social Justice & Empowerment
            </p>
          </div>

          {/* Login Form */}
          <div className="space-y-6">
            <h3 className="text-2xl font-heading font-semibold text-white mb-8 text-center">Sign in to your account</h3>
            
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-neutral-200">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={onChange}
                  className="w-full px-5 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:bg-white/15"
                  placeholder="Enter your email address"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-neutral-200">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={onChange}
                  className="w-full px-5 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:bg-white/15"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-8 bg-gradient-to-r from-primary-500 to-primary-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-primary-600 hover:to-primary-700 hover:scale-[1.02] hover:shadow-hover focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 disabled:from-neutral-600 disabled:to-neutral-700 disabled:cursor-not-allowed disabled:scale-100 shadow-card"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : 'Sign in'}
              </button>
            </form>

            {/* Signup Link */}
            <div className="text-center mt-6">
              <p className="text-sm text-neutral-300">
                Don't have an account?{' '}
                <Link 
                  to="/signup" 
                  className="font-semibold text-primary-400 hover:text-primary-300 transition-colors duration-200"
                >
                  Sign up here
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

            {/* Demo Credentials */}
            <div className="mt-8 p-5 bg-gradient-to-br from-secondary-800/30 to-secondary-900/30 backdrop-blur-sm rounded-xl border border-secondary-600/30">
              <p className="text-sm font-semibold text-accent-400 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Demo Credentials
              </p>
              <div className="text-sm text-neutral-300 space-y-2 font-body">
                <p className="flex justify-between"><span className="text-neutral-400">MoSJE Admin:</span> <span className="font-mono text-xs">admin@mosje.gov.in / admin123</span></p>
                <p className="flex justify-between"><span className="text-neutral-400">State Admin:</span> <span className="font-mono text-xs">state@example.com / state123</span></p>
                <p className="flex justify-between"><span className="text-neutral-400">Agency User:</span> <span className="font-mono text-xs">agency@example.com / agency123</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-neutral-400 font-body">
          © {new Date().getFullYear()} Ministry of Social Justice & Empowerment. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
