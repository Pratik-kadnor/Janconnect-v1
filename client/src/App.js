import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import { ThemeProvider } from './contexts/ThemeContext';
import PrivateRoute from './components/PrivateRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ProjectsListPage from './pages/ProjectsListPage';
import SingleProjectPage from './pages/SingleProjectPage';
import NewProjectPage from './pages/NewProjectPage';
import EditProjectPage from './pages/EditProjectPage';
import AllUsersPage from './pages/AllUsersPage';
import ReportsPage from './pages/ReportsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import AgenciesPage from './pages/AgenciesPage';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Private Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <PrivateRoute>
                <ProjectsListPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/projects/new"
            element={
              <PrivateRoute roles={['State-Admin', 'MoSJE-Admin']}>
                <NewProjectPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/projects/:id/edit"
            element={
              <PrivateRoute roles={['State-Admin', 'MoSJE-Admin']}>
                <EditProjectPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/projects/:id"
            element={
              <PrivateRoute>
                <SingleProjectPage />
              </PrivateRoute>
            }
          />

          {/* All Users (Admin Only) */}
          <Route
            path="/users"
            element={
              <PrivateRoute roles={['MoSJE-Admin']}>
                <AllUsersPage />
              </PrivateRoute>
            }
          />

          {/* Profile Page */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />

          {/* Agencies Page */}
          <Route
            path="/agencies"
            element={
              <PrivateRoute roles={['State-Admin', 'MoSJE-Admin']}>
                <AgenciesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <PrivateRoute roles={['State-Admin', 'MoSJE-Admin']}>
                <ReportsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <PrivateRoute roles={['State-Admin', 'MoSJE-Admin']}>
                <AnalyticsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute roles={['MoSJE-Admin']}>
                <SettingsPage />
              </PrivateRoute>
            }
          />

          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 404 Route */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-900">404</h1>
                  <p className="text-xl text-gray-600 mt-4">Page not found</p>
                  <a href="/" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
                    Go to Home
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
