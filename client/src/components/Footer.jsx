import React from 'react';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-neutral-900 via-primary-900 to-neutral-900 text-white mt-auto border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-8 py-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-8">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-5">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-1.5 border border-primary-500/30 shadow-soft">
                <img src="/assets/logo.png" alt="JanConnect Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="text-lg font-heading font-bold">JanConnect</h3>
                <p className="text-xs text-primary-300 font-medium">PM-AJAY Portal</p>
              </div>
            </div>
            <p className="text-sm text-neutral-300 leading-relaxed font-body">
              A comprehensive portal for managing and monitoring projects under the PM-AJAY scheme by the Ministry of Social Justice & Empowerment.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-heading font-semibold mb-5 text-white border-b border-primary-700/30 pb-2">Quick Links</h3>
            <ul className="space-y-3 text-sm font-body">
              <li>
                <a href="/dashboard" className="text-neutral-300 hover:text-accent-400 transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-3 group-hover:bg-accent-400 transition-colors"></span>
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/projects" className="text-neutral-300 hover:text-accent-400 transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-3 group-hover:bg-accent-400 transition-colors"></span>
                  Projects
                </a>
              </li>
              <li>
                <a href="https://socialjustice.gov.in/" target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-accent-400 transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-3 group-hover:bg-accent-400 transition-colors"></span>
                  Ministry Website
                </a>
              </li>
              <li>
                <a href="https://www.india.gov.in/" target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-accent-400 transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-3 group-hover:bg-accent-400 transition-colors"></span>
                  National Portal of India
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-heading font-semibold mb-5 text-white border-b border-primary-700/30 pb-2">Contact Us</h3>
            <ul className="space-y-4 text-sm text-neutral-300 font-body">
              <li className="flex items-start space-x-3 group">
                <div className="mt-1 p-2 bg-primary-800/50 rounded-lg group-hover:bg-primary-700/50 transition-colors">
                  <FiMapPin className="flex-shrink-0 text-accent-400" size={16} />
                </div>
                <span className="leading-relaxed">
                  Ministry of Social Justice & Empowerment<br />
                  Shastri Bhawan, New Delhi - 110001
                </span>
              </li>
              <li className="flex items-center space-x-3 group">
                <div className="p-2 bg-primary-800/50 rounded-lg group-hover:bg-primary-700/50 transition-colors">
                  <FiPhone className="flex-shrink-0 text-accent-400" size={16} />
                </div>
                <span>+91-11-23381708</span>
              </li>
              <li className="flex items-center space-x-3 group">
                <div className="p-2 bg-primary-800/50 rounded-lg group-hover:bg-primary-700/50 transition-colors">
                  <FiMail className="flex-shrink-0 text-accent-400" size={16} />
                </div>
                <span>support@janconnect.gov.in</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-neutral-400 font-body">
            <p>
              © {new Date().getFullYear()} Ministry of Social Justice & Empowerment, Government of India. All rights reserved.
            </p>
            <div className="flex space-x-8 mt-4 md:mt-0">
              <button className="hover:text-accent-400 transition-colors duration-200">
                Privacy Policy
              </button>
              <button className="hover:text-accent-400 transition-colors duration-200">
                Terms of Service
              </button>
              <button className="hover:text-accent-400 transition-colors duration-200">
                Help
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
