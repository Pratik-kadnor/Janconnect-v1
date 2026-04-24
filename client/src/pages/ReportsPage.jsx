import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  FiDownload, 
  FiFilter, 
  FiMapPin, 
  FiUsers, 
  FiDollarSign,
  FiTrendingUp,
  FiFileText,
  FiPrinter,
  FiRefreshCw,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
  FiTarget
} from 'react-icons/fi';

const ReportsPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Minimal authorization check - PrivateRoute already handles the main check
  useEffect(() => {
    if (!user) {
      console.log('ReportsPage: No user found, redirecting to login');
      navigate('/login');
    }
  }, [user, navigate]);

  // State management
  const [projects, setProjects] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  
  // Filter state
  const [reportType, setReportType] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedComponent, setSelectedComponent] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [selectedStatus, setSelectedStatus] = useState('');

  // User data and token
  const token = user?.token || JSON.parse(localStorage.getItem('user'))?.token;

  // Indian states
  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  const components = ['Adarsh Gram', 'GIA', 'Hostel'];
  const statuses = ['Sanctioned', 'In-Progress', 'Completed', 'Delayed'];

  // Fetch data on mount
  useEffect(() => {
    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError('');
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [projectsRes, agenciesRes, usersRes] = await Promise.all([
        axios.get('/api/projects', config),
        axios.get('/api/agencies', config),
        axios.get('/api/users', config)
      ]);

      setProjects(projectsRes.data);
      setAgencies(agenciesRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = () => {
    let filteredProjects = [...projects];

    // Apply filters
    if (selectedState) {
      filteredProjects = filteredProjects.filter(p => p.state === selectedState);
    }
    if (selectedComponent) {
      filteredProjects = filteredProjects.filter(p => p.component === selectedComponent);
    }
    if (selectedStatus) {
      filteredProjects = filteredProjects.filter(p => p.status === selectedStatus);
    }
    if (dateRange.from) {
      filteredProjects = filteredProjects.filter(p => 
        new Date(p.sanctionDate) >= new Date(dateRange.from)
      );
    }
    if (dateRange.to) {
      filteredProjects = filteredProjects.filter(p => 
        new Date(p.sanctionDate) <= new Date(dateRange.to)
      );
    }

    const totalBudget = filteredProjects.reduce((sum, p) => 
      sum + (p.financials?.totalBudget || 0), 0
    );
    const fundsReleased = filteredProjects.reduce((sum, p) => 
      sum + (p.financials?.fundsReleased || 0), 0
    );
    const fundsUtilized = filteredProjects.reduce((sum, p) => 
      sum + (p.financials?.fundsUtilized || 0), 0
    );

    return {
      totalProjects: filteredProjects.length,
      completed: filteredProjects.filter(p => p.status === 'Completed').length,
      inProgress: filteredProjects.filter(p => p.status === 'In-Progress').length,
      delayed: filteredProjects.filter(p => p.status === 'Delayed').length,
      sanctioned: filteredProjects.filter(p => p.status === 'Sanctioned').length,
      totalBudget,
      fundsReleased,
      fundsUtilized,
      utilizationRate: totalBudget > 0 ? ((fundsUtilized / totalBudget) * 100).toFixed(2) : 0,
      releaseRate: totalBudget > 0 ? ((fundsReleased / totalBudget) * 100).toFixed(2) : 0,
      totalBeneficiaries: filteredProjects.reduce((sum, p) => 
        sum + (p.beneficiaries || 0), 0
      ),
      filteredProjects
    };
  };

  const stats = calculateStats();

  // Report types
  const reportTypes = [
    { value: 'project-summary', label: 'Project Summary Report', icon: FiFileText },
    { value: 'financial', label: 'Financial Report', icon: FiDollarSign },
    { value: 'state-wise', label: 'State-wise Report', icon: FiMapPin },
    { value: 'component-wise', label: 'Component-wise Report', icon: FiTarget },
    { value: 'agency-performance', label: 'Agency Performance Report', icon: FiUsers },
    { value: 'milestone-tracking', label: 'Milestone Tracking Report', icon: FiCheckCircle },
    { value: 'beneficiary-impact', label: 'Beneficiary Impact Report', icon: FiTrendingUp },
    { value: 'delay-analysis', label: 'Delay Analysis Report', icon: FiAlertCircle }
  ];

  // Generate report
  const generateReport = () => {
    if (!reportType) {
      setError('Please select a report type');
      return;
    }

    setGenerating(true);
    setTimeout(() => {
      // Simulate report generation
      downloadReport();
      setGenerating(false);
    }, 2000);
  };

  // Download report as CSV
  const downloadReport = () => {
    let csvContent = '';
    let filename = '';

    switch (reportType) {
      case 'project-summary':
        filename = 'project-summary-report.csv';
        csvContent = generateProjectSummaryCSV();
        break;
      case 'financial':
        filename = 'financial-report.csv';
        csvContent = generateFinancialReportCSV();
        break;
      case 'state-wise':
        filename = 'state-wise-report.csv';
        csvContent = generateStateWiseReportCSV();
        break;
      case 'component-wise':
        filename = 'component-wise-report.csv';
        csvContent = generateComponentWiseReportCSV();
        break;
      case 'agency-performance':
        filename = 'agency-performance-report.csv';
        csvContent = generateAgencyPerformanceReportCSV();
        break;
      case 'milestone-tracking':
        filename = 'milestone-tracking-report.csv';
        csvContent = generateMilestoneTrackingReportCSV();
        break;
      case 'beneficiary-impact':
        filename = 'beneficiary-impact-report.csv';
        csvContent = generateBeneficiaryImpactReportCSV();
        break;
      case 'delay-analysis':
        filename = 'delay-analysis-report.csv';
        csvContent = generateDelayAnalysisReportCSV();
        break;
      default:
        return;
    }

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV generation functions
  const generateProjectSummaryCSV = () => {
    let csv = 'Project Title,Component,State,District,Status,Budget,Funds Released,Funds Utilized,Beneficiaries,Sanction Date,Expected Completion\n';
    stats.filteredProjects.forEach(p => {
      csv += `"${p.title}","${p.component}","${p.state}","${p.district}","${p.status}",`;
      csv += `${p.financials?.totalBudget || 0},${p.financials?.fundsReleased || 0},${p.financials?.fundsUtilized || 0},`;
      csv += `${p.beneficiaries || 0},"${new Date(p.sanctionDate).toLocaleDateString()}","${new Date(p.expectedCompletionDate).toLocaleDateString()}"\n`;
    });
    return csv;
  };

  const generateFinancialReportCSV = () => {
    let csv = 'State,Component,Total Budget,Funds Released,Funds Utilized,Utilization Rate (%)\n';
    const stateMap = {};
    
    stats.filteredProjects.forEach(p => {
      const key = `${p.state}-${p.component}`;
      if (!stateMap[key]) {
        stateMap[key] = { state: p.state, component: p.component, budget: 0, released: 0, utilized: 0 };
      }
      stateMap[key].budget += p.financials?.totalBudget || 0;
      stateMap[key].released += p.financials?.fundsReleased || 0;
      stateMap[key].utilized += p.financials?.fundsUtilized || 0;
    });

    Object.values(stateMap).forEach(item => {
      const rate = item.budget > 0 ? ((item.utilized / item.budget) * 100).toFixed(2) : 0;
      csv += `"${item.state}","${item.component}",${item.budget},${item.released},${item.utilized},${rate}\n`;
    });
    return csv;
  };

  const generateStateWiseReportCSV = () => {
    let csv = 'State,Total Projects,Completed,In Progress,Delayed,Total Budget,Beneficiaries\n';
    const stateMap = {};
    
    stats.filteredProjects.forEach(p => {
      if (!stateMap[p.state]) {
        stateMap[p.state] = { total: 0, completed: 0, inProgress: 0, delayed: 0, budget: 0, beneficiaries: 0 };
      }
      stateMap[p.state].total++;
      if (p.status === 'Completed') stateMap[p.state].completed++;
      if (p.status === 'In-Progress') stateMap[p.state].inProgress++;
      if (p.status === 'Delayed') stateMap[p.state].delayed++;
      stateMap[p.state].budget += p.financials?.totalBudget || 0;
      stateMap[p.state].beneficiaries += p.beneficiaries || 0;
    });

    Object.entries(stateMap).forEach(([state, data]) => {
      csv += `"${state}",${data.total},${data.completed},${data.inProgress},${data.delayed},${data.budget},${data.beneficiaries}\n`;
    });
    return csv;
  };

  const generateComponentWiseReportCSV = () => {
    let csv = 'Component,Total Projects,Completed,In Progress,Delayed,Total Budget,Avg Budget per Project\n';
    const compMap = {};
    
    stats.filteredProjects.forEach(p => {
      if (!compMap[p.component]) {
        compMap[p.component] = { total: 0, completed: 0, inProgress: 0, delayed: 0, budget: 0 };
      }
      compMap[p.component].total++;
      if (p.status === 'Completed') compMap[p.component].completed++;
      if (p.status === 'In-Progress') compMap[p.component].inProgress++;
      if (p.status === 'Delayed') compMap[p.component].delayed++;
      compMap[p.component].budget += p.financials?.totalBudget || 0;
    });

    Object.entries(compMap).forEach(([comp, data]) => {
      const avgBudget = data.total > 0 ? (data.budget / data.total).toFixed(2) : 0;
      csv += `"${comp}",${data.total},${data.completed},${data.inProgress},${data.delayed},${data.budget},${avgBudget}\n`;
    });
    return csv;
  };

  const generateAgencyPerformanceReportCSV = () => {
    let csv = 'Agency Name,Type,State,Total Projects,Completed Projects,Completion Rate (%)\n';
    const agencyMap = {};
    
    stats.filteredProjects.forEach(p => {
      [p.implementingAgency, p.executingAgency].forEach(agencyId => {
        const agency = agencies.find(a => a._id === agencyId);
        if (agency) {
          if (!agencyMap[agency._id]) {
            agencyMap[agency._id] = { 
              name: agency.name, 
              type: agency.type, 
              state: agency.state, 
              total: 0, 
              completed: 0 
            };
          }
          agencyMap[agency._id].total++;
          if (p.status === 'Completed') agencyMap[agency._id].completed++;
        }
      });
    });

    Object.values(agencyMap).forEach(agency => {
      const rate = agency.total > 0 ? ((agency.completed / agency.total) * 100).toFixed(2) : 0;
      csv += `"${agency.name}","${agency.type}","${agency.state}",${agency.total},${agency.completed},${rate}\n`;
    });
    return csv;
  };

  const generateMilestoneTrackingReportCSV = () => {
    let csv = 'Project Title,Total Milestones,Completed Milestones,Pending Milestones,Completion Rate (%)\n';
    
    stats.filteredProjects.forEach(p => {
      const totalMilestones = p.milestones?.length || 0;
      const completedMilestones = p.milestones?.filter(m => m.status === 'Completed').length || 0;
      const pendingMilestones = totalMilestones - completedMilestones;
      const rate = totalMilestones > 0 ? ((completedMilestones / totalMilestones) * 100).toFixed(2) : 0;
      csv += `"${p.title}",${totalMilestones},${completedMilestones},${pendingMilestones},${rate}\n`;
    });
    return csv;
  };

  const generateBeneficiaryImpactReportCSV = () => {
    let csv = 'State,Component,Total Projects,Total Beneficiaries,Avg Beneficiaries per Project\n';
    const impactMap = {};
    
    stats.filteredProjects.forEach(p => {
      const key = `${p.state}-${p.component}`;
      if (!impactMap[key]) {
        impactMap[key] = { state: p.state, component: p.component, projects: 0, beneficiaries: 0 };
      }
      impactMap[key].projects++;
      impactMap[key].beneficiaries += p.beneficiaries || 0;
    });

    Object.values(impactMap).forEach(item => {
      const avg = item.projects > 0 ? (item.beneficiaries / item.projects).toFixed(2) : 0;
      csv += `"${item.state}","${item.component}",${item.projects},${item.beneficiaries},${avg}\n`;
    });
    return csv;
  };

  const generateDelayAnalysisReportCSV = () => {
    let csv = 'Project Title,State,Component,Status,Expected Completion,Days Delayed,Reason\n';
    
    stats.filteredProjects.forEach(p => {
      if (p.status === 'Delayed') {
        const today = new Date();
        const expectedDate = new Date(p.expectedCompletionDate);
        const daysDelayed = Math.floor((today - expectedDate) / (1000 * 60 * 60 * 24));
        csv += `"${p.title}","${p.state}","${p.component}","${p.status}","${expectedDate.toLocaleDateString()}",${daysDelayed},"${p.description || 'N/A'}"\n`;
      }
    });
    return csv;
  };

  // Print report
  const printReport = () => {
    window.print();
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <FiFileText className="text-blue-600" />
            Reports & Documentation
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Generate comprehensive reports for PM-AJAY scheme implementation
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-2">
            <FiAlertCircle className="text-red-600 dark:text-red-400" />
            <span className="text-red-800 dark:text-red-200">{error}</span>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Projects</p>
                <h3 className="text-3xl font-bold mt-2">{stats.totalProjects}</h3>
              </div>
              <FiTarget className="text-4xl text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Completed</p>
                <h3 className="text-3xl font-bold mt-2">{stats.completed}</h3>
              </div>
              <FiCheckCircle className="text-4xl text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">In Progress</p>
                <h3 className="text-3xl font-bold mt-2">{stats.inProgress}</h3>
              </div>
              <FiClock className="text-4xl text-yellow-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Delayed</p>
                <h3 className="text-3xl font-bold mt-2">{stats.delayed}</h3>
              </div>
              <FiAlertCircle className="text-4xl text-red-200" />
            </div>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FiDollarSign className="text-green-600" />
            Financial Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                ₹{stats.totalBudget.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Funds Released</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                ₹{stats.fundsReleased.toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stats.releaseRate}% of budget
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Funds Utilized</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                ₹{stats.fundsUtilized.toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stats.utilizationRate}% of budget
              </p>
            </div>
          </div>
        </div>

        {/* Report Generation Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <FiFilter className="text-blue-600" />
            Generate Report
          </h2>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Report Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Report Type *
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Report Type</option>
                {reportTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* State Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                State
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All States</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            {/* Component Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Component
              </label>
              <select
                value={selectedComponent}
                onChange={(e) => setSelectedComponent(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Components</option>
                {components.map(comp => (
                  <option key={comp} value={comp}>{comp}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Statuses</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Date From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                From Date
              </label>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                To Date
              </label>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={generateReport}
              disabled={generating || !reportType}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {generating ? (
                <>
                  <FiRefreshCw className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FiDownload />
                  Generate & Download
                </>
              )}
            </button>

            <button
              onClick={printReport}
              className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FiPrinter />
              Print Report
            </button>

            <button
              onClick={fetchAllData}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FiRefreshCw />
              Refresh Data
            </button>
          </div>
        </div>

        {/* Available Reports */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Available Report Types
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reportTypes.map(type => {
              const Icon = type.icon;
              return (
                <div
                  key={type.value}
                  onClick={() => setReportType(type.value)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    reportType === type.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                  }`}
                >
                  <Icon className={`text-2xl mb-2 ${
                    reportType === type.value ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'
                  }`} />
                  <h3 className={`font-medium ${
                    reportType === type.value 
                      ? 'text-blue-900 dark:text-blue-100' 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {type.label}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>

        {/* Impact Summary */}
        <div className="mt-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FiTrendingUp className="text-2xl" />
            Impact Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-purple-100 text-sm">Total Beneficiaries</p>
              <p className="text-3xl font-bold mt-1">{stats.totalBeneficiaries.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p className="text-purple-100 text-sm">Active Agencies</p>
              <p className="text-3xl font-bold mt-1">{agencies.filter(a => a.isActive).length}</p>
            </div>
            <div>
              <p className="text-purple-100 text-sm">Total Users</p>
              <p className="text-3xl font-bold mt-1">{users.length}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReportsPage;
