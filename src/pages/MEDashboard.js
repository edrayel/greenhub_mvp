import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar, 
  Download, 
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  Target
} from 'lucide-react';
import napData from '../data/nap_metrics.json';

/**
 * M&E Dashboard component for monitoring National Adaptation Plan progress
 * @returns {React.Component} M&E Dashboard page
 */
const MEDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedProjectType, setSelectedProjectType] = useState('all');

  // Load NAP metrics data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setData(napData);
      } catch (error) {
        console.error('Error loading NAP metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter projects based on selected filters
  const filteredProjects = useMemo(() => {
    if (!data) return [];
    
    let filtered = data.project_data;
    
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(project => project.region === selectedRegion);
    }
    
    if (selectedProjectType !== 'all') {
      filtered = filtered.filter(project => project.type === selectedProjectType);
    }
    
    return filtered;
  }, [data, selectedRegion, selectedProjectType]);

  // Calculate filtered metrics
  const filteredMetrics = useMemo(() => {
    if (!filteredProjects.length) return null;
    
    const totalBudget = filteredProjects.reduce((sum, p) => sum + p.budget, 0);
    const totalSpent = filteredProjects.reduce((sum, p) => sum + p.spent, 0);
    const completed = filteredProjects.filter(p => p.status === 'completed').length;
    const ongoing = filteredProjects.filter(p => p.status === 'ongoing').length;
    const planned = filteredProjects.filter(p => p.status === 'planned').length;
    
    return {
      totalProjects: filteredProjects.length,
      completedProjects: completed,
      ongoingProjects: ongoing,
      plannedProjects: planned,
      budgetAllocated: totalBudget,
      budgetUtilized: totalSpent,
      utilizationRate: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0
    };
  }, [filteredProjects]);

  // Chart data preparations
  const projectStatusData = useMemo(() => {
    if (!filteredMetrics) return [];
    
    return [
      { name: 'Completed', value: filteredMetrics.completedProjects, color: '#22c55e' },
      { name: 'Ongoing', value: filteredMetrics.ongoingProjects, color: '#3b82f6' },
      { name: 'Planned', value: filteredMetrics.plannedProjects, color: '#eab308' }
    ];
  }, [filteredMetrics]);

  const projectTypeData = useMemo(() => {
    if (!filteredProjects.length) return [];
    
    const typeCount = {};
    filteredProjects.forEach(project => {
      typeCount[project.type] = (typeCount[project.type] || 0) + 1;
    });
    
    return Object.entries(typeCount).map(([type, count]) => ({
      type,
      count,
      budget: filteredProjects
        .filter(p => p.type === type)
        .reduce((sum, p) => sum + p.budget, 0) / 1000000 // Convert to millions
    }));
  }, [filteredProjects]);

  const regionData = useMemo(() => {
    if (!filteredProjects.length) return [];
    
    const regionStats = {};
    filteredProjects.forEach(project => {
      if (!regionStats[project.region]) {
        regionStats[project.region] = {
          region: project.region,
          projects: 0,
          budget: 0,
          spent: 0
        };
      }
      regionStats[project.region].projects += 1;
      regionStats[project.region].budget += project.budget / 1000000; // Convert to millions
      regionStats[project.region].spent += project.spent / 1000000;
    });
    
    return Object.values(regionStats);
  }, [filteredProjects]);

  // Get unique values for filters
  const filterOptions = useMemo(() => {
    if (!data) return { regions: [], projectTypes: [] };
    
    return {
      regions: [...new Set(data.project_data.map(p => p.region))].sort(),
      projectTypes: [...new Set(data.project_data.map(p => p.type))].sort()
    };
  }, [data]);

  /**
   * Export dashboard data as PDF (simplified - would use a proper PDF library in production)
   */
  const exportReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      filters: {
        timeframe: selectedTimeframe,
        region: selectedRegion,
        projectType: selectedProjectType
      },
      metrics: filteredMetrics,
      projects: filteredProjects
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nap_report_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  /**
   * Get status color
   * @param {string} status - Project status
   * @returns {string} Color class
   */
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'ongoing':
        return 'text-blue-600 bg-blue-100';
      case 'planned':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  /**
   * Get status icon
   * @param {string} status - Project status
   * @returns {React.Component} Status icon
   */
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'ongoing':
        return <Clock className="h-4 w-4" />;
      case 'planned':
        return <Target className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4" />
          <p className="text-gray-600">Loading M&E Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data || !filteredMetrics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-8 w-8 text-primary-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">M&E Dashboard</h1>
                <p className="text-gray-600 mt-1">
                  Monitor and evaluate National Adaptation Plan progress
                </p>
              </div>
            </div>
            <button
              onClick={exportReport}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              <Download className="h-4 w-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="form-select"
              >
                <option value="all">All Regions</option>
                {filterOptions.regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
              <select
                value={selectedProjectType}
                onChange={(e) => setSelectedProjectType(e.target.value)}
                className="form-select"
              >
                <option value="all">All Types</option>
                {filterOptions.projectTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Timeframe</label>
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="form-select"
              >
                <option value="all">All Time</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="stats-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-3xl font-bold text-gray-900">{filteredMetrics.totalProjects}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="stats-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-green-600">{filteredMetrics.completedProjects}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="stats-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Budget Utilization</p>
                <p className="text-3xl font-bold text-primary-600">
                  {filteredMetrics.utilizationRate.toFixed(1)}%
                </p>
              </div>
              <div className="bg-primary-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </div>
          
          <div className="stats-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Budget</p>
                <p className="text-3xl font-bold text-gray-900">
                  ₦{(filteredMetrics.budgetAllocated / 1000000).toFixed(0)}M
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Project Status Pie Chart */}
          <div className="chart-container">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Status Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {projectStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Project Types Bar Chart */}
          <div className="chart-container">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Projects by Type</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectTypeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#3b82f6" name="Project Count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Regional Distribution */}
          <div className="chart-container">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget by Region</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₦${value.toFixed(1)}M`, '']} />
                  <Legend />
                  <Bar dataKey="budget" fill="#22c55e" name="Allocated (₦M)" />
                  <Bar dataKey="spent" fill="#ef4444" name="Spent (₦M)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Progress */}
          <div className="chart-container">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Progress</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.monthly_progress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [
                    name === 'budget_spent' ? `₦${(value / 1000000).toFixed(1)}M` : value,
                    name === 'budget_spent' ? 'Budget Spent' : 'Projects Completed'
                  ]} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="projects_completed" 
                    stroke="#3b82f6" 
                    name="Projects Completed"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="budget_spent" 
                    stroke="#22c55e" 
                    name="Budget Spent"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Project Details</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Region</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Progress</th>
                  <th>Budget</th>
                  <th>Spent</th>
                  <th>Expected Completion</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr key={project.id}>
                    <td className="font-medium">{project.name}</td>
                    <td>{project.region}</td>
                    <td>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {project.type}
                      </span>
                    </td>
                    <td>
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {getStatusIcon(project.status)}
                        <span className="capitalize">{project.status}</span>
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full" 
                            style={{ width: `${project.completion_percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{project.completion_percentage}%</span>
                      </div>
                    </td>
                    <td>₦{(project.budget / 1000000).toFixed(1)}M</td>
                    <td>₦{(project.spent / 1000000).toFixed(1)}M</td>
                    <td>{project.expected_completion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MEDashboard;