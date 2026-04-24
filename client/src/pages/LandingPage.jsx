import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiArrowRight, FiCheck, FiUsers, FiBarChart2, FiShield, FiTarget, FiAward, FiTrendingUp } from 'react-icons/fi';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [scrollY, setScrollY] = useState(0);

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: FiUsers,
      title: "Multi-Level Access",
      description: "Role-based system for MoSJE Admins, State Admins, and Agency Users"
    },
    {
      icon: FiBarChart2,
      title: "Real-Time Analytics",
      description: "Interactive dashboards with comprehensive project insights and metrics"
    },
    {
      icon: FiShield,
      title: "Secure & Reliable",
      description: "JWT-based authentication with enterprise-grade security"
    },
    {
      icon: FiTarget,
      title: "Milestone Tracking",
      description: "Track project progress with evidence-based milestone management"
    },
    {
      icon: FiAward,
      title: "Agency Coordination",
      description: "Seamless coordination between implementing and executing agencies"
    },
    {
      icon: FiTrendingUp,
      title: "Financial Monitoring",
      description: "Real-time tracking of budget allocation, release, and utilization"
    }
  ];

  const benefits = [
    "Centralized project management platform",
    "Transparent fund utilization tracking",
    "Automated milestone tracking with evidence",
    "State-wise and agency-wise project monitoring",
    "Real-time reports and analytics",
    "Document management system",
    "Secure data storage with cloud integration",
    "Mobile-responsive design for on-the-go access"
  ];

  const stats = [
    { number: "100+", label: "Projects Managed" },
    { number: "50+", label: "Agencies Connected" },
    { number: "28", label: "States Covered" },
    { number: "99.9%", label: "Uptime Reliability" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50 to-secondary-100">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-neutral-200 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2 border-2 border-primary-500 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <img src="/assets/logo.png" alt="JanConnect Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  JanConnect
                </h1>
                <p className="text-xs text-primary-600 font-semibold">PM-AJAY Portal</p>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2.5 text-sm font-semibold text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-xl transition-all duration-200"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
              >
                <span>Get Started</span>
                <FiArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Background */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url(/assets/background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-800/85 to-secondary-900/90"></div>
        
        {/* Animated circles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 py-32 text-center">
          <div 
            className="max-w-4xl mx-auto"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          >
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-white text-sm font-semibold">Ministry of Social Justice & Empowerment</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-6 leading-tight">
              Empowering Communities Through
              <span className="block mt-2 bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent">
                Digital Governance
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto">
              JanConnect - A comprehensive digital platform for managing and monitoring projects under the 
              <span className="font-bold text-yellow-300"> PM-AJAY (Pradhan Mantri Anusuchit Jaati Abhyuday Yojana) </span>
              scheme, ensuring transparency, efficiency, and accountability.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button
                onClick={() => navigate('/signup')}
                className="group px-8 py-4 text-lg font-semibold text-primary-900 bg-white hover:bg-neutral-50 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center space-x-2"
              >
                <span>Register Now</span>
                <FiArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 text-lg font-semibold text-white bg-white/10 backdrop-blur-md hover:bg-white/20 border-2 border-white/30 rounded-xl transition-all duration-300"
              >
                Sign In
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-sm text-white/80 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-neutral-900 mb-4">
                About PM-AJAY Scheme
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-primary-600 to-secondary-600 mx-auto mb-6"></div>
              <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
                A flagship initiative by the Ministry of Social Justice & Empowerment, Government of India
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8 border border-primary-200">
                  <h3 className="text-2xl font-bold text-neutral-900 mb-4">Mission & Vision</h3>
                  <p className="text-neutral-700 leading-relaxed mb-4">
                    The PM-AJAY scheme aims to uplift and empower Scheduled Caste communities through 
                    comprehensive socio-economic development programs. Our mission is to ensure transparent, 
                    efficient, and accountable project management across all implementing agencies.
                  </p>
                  <p className="text-neutral-700 leading-relaxed">
                    JanConnect serves as the digital backbone of this initiative, enabling seamless 
                    coordination between central ministries, state governments, and executing agencies.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-secondary-50 to-primary-50 rounded-2xl p-8 border border-secondary-200">
                  <h3 className="text-2xl font-bold text-neutral-900 mb-4">Key Objectives</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <FiCheck className="text-green-600 flex-shrink-0 mt-1" size={20} />
                      <span className="text-neutral-700">Transparent fund allocation and utilization tracking</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <FiCheck className="text-green-600 flex-shrink-0 mt-1" size={20} />
                      <span className="text-neutral-700">Real-time project monitoring and reporting</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <FiCheck className="text-green-600 flex-shrink-0 mt-1" size={20} />
                      <span className="text-neutral-700">Evidence-based milestone verification</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <FiCheck className="text-green-600 flex-shrink-0 mt-1" size={20} />
                      <span className="text-neutral-700">Multi-stakeholder collaboration platform</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl p-8 text-white shadow-2xl">
                  <h3 className="text-3xl font-bold mb-6">Why JanConnect?</h3>
                  <div className="space-y-4">
                    {benefits.slice(0, 4).map((benefit, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <FiCheck size={14} />
                        </div>
                        <span className="text-white/95">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
                    <div className="text-sm text-green-700 font-medium">System Availability</div>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
                    <div className="text-sm text-blue-700 font-medium">Data Security</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-neutral-50 to-primary-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-neutral-900 mb-4">
              Powerful Features
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-600 to-secondary-600 mx-auto mb-6"></div>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Comprehensive tools designed for efficient project management and monitoring
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-neutral-200 hover:border-primary-300 hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <feature.icon className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">{feature.title}</h3>
                <p className="text-neutral-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-neutral-900 mb-4">
                Key Benefits
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-primary-600 to-secondary-600 mx-auto mb-6"></div>
              <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
                Transforming governance through digital innovation
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6 border border-primary-200 hover:border-primary-400 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <FiCheck className="text-white" size={20} />
                  </div>
                  <span className="text-neutral-800 font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-secondary-600 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-48 translate-y-48"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Join JanConnect today and be part of India's digital governance revolution. 
              Register your agency or organization to start managing projects efficiently.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/signup')}
                className="group px-8 py-4 text-lg font-semibold text-primary-600 bg-white hover:bg-neutral-50 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center space-x-2"
              >
                <span>Create Account</span>
                <FiArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 text-lg font-semibold text-white bg-white/10 backdrop-blur-md hover:bg-white/20 border-2 border-white/30 rounded-xl transition-all duration-300"
              >
                Already Have Account?
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* About */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1.5">
                  <img src="/assets/logo.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
                <h3 className="text-xl font-bold">JanConnect</h3>
              </div>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Empowering communities through digital governance under PM-AJAY scheme.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button onClick={() => navigate('/login')} className="text-neutral-400 hover:text-white transition-colors">
                    Login
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/signup')} className="text-neutral-400 hover:text-white transition-colors">
                    Register
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <p className="text-neutral-400 text-sm mb-2">Ministry of Social Justice & Empowerment</p>
              <p className="text-neutral-400 text-sm mb-2">Government of India</p>
              <p className="text-neutral-400 text-sm">Email: support@janconnect.gov.in</p>
            </div>
          </div>

          <div className="border-t border-neutral-800 pt-8 text-center">
            <p className="text-neutral-400 text-sm">
              © 2025 JanConnect - PM-AJAY Portal. All rights reserved. | Ministry of Social Justice & Empowerment, Government of India
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
