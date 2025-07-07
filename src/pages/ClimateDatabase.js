import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Download, Eye, BarChart3, MapPin, Calendar, Database } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import climateData from '../data/climate_data.json';

/**
 * Climate Database component with search, filtering, and data visualization
 * @returns {React.Component} Climate database page
 */
const ClimateDatabase = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    region: '',
    hazardType: '',
    dataType: '',
    timePeriod: '',
    source: '',
    searchTerm: ''
  });

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setData(climateData.climate_data);
        setFilteredData(climateData.climate_data);
      } catch (error) {
        console.error('Error loading climate data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Get unique values for filter options
  const filterOptions = useMemo(() => {
    return {
      regions: [...new Set(data.map(item => item.region))].sort(),
      hazardTypes: [...new Set(data.map(item => item.hazard_type))].sort(),
      dataTypes: [...new Set(data.map(item => item.data_type))].sort(),
      timePeriods: [...new Set(data.map(item => item.time_period))].sort(),
      sources: [...new Set(data.map(item => item.source))].sort()
    };
  }, [data]);

  // Apply filters
  useEffect(() => {
    let filtered = data;

    // Apply search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.region.toLowerCase().includes(searchLower) ||
        item.hazard_type.toLowerCase().includes(searchLower) ||
        item.data_type.toLowerCase().includes(searchLower) ||
        item.source.toLowerCase().includes(searchLower)
      );
    }

    // Apply other filters
    if (filters.region) {
      filtered = filtered.filter(item => item.region === filters.region);
    }
    if (filters.hazardType) {
      filtered = filtered.filter(item => item.hazard_type === filters.hazardType);
    }
    if (filters.dataType) {
      filtered = filtered.filter(item => item.data_type === filters.dataType);
    }
    if (filters.timePeriod) {
      filtered = filtered.filter(item => item.time_period === filters.timePeriod);
    }
    if (filters.source) {
      filtered = filtered.filter(item => item.source === filters.source);
    }

    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, data]);

  /**
   * Handle filter changes
   * @param {string} filterName - Name of the filter
   * @param {string} value - Filter value
   */
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  /**
   * Clear all filters
   */
  const clearFilters = () => {
    setFilters({
      region: '',
      hazardType: '',
      dataType: '',
      timePeriod: '',
      source: '',
      searchTerm: ''
    });
  };

  /**
   * Export data to CSV
   */
  const exportToCSV = () => {
    const headers = ['ID', 'Region', 'Hazard Type', 'Data Type', 'Value', 'Unit', 'Time Period', 'Source', 'Last Updated'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(item => [
        item.id,
        item.region,
        item.hazard_type,
        item.data_type,
        item.value,
        item.unit,
        item.time_period,
        item.source,
        item.last_updated
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'climate_data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  /**
   * Export data to JSON
   */
  const exportToJSON = () => {
    const jsonContent = JSON.stringify(filteredData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'climate_data.json';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Chart data preparation
  const chartData = useMemo(() => {
    const regionData = {};
    filteredData.forEach(item => {
      if (!regionData[item.region]) {
        regionData[item.region] = { region: item.region, count: 0, avgValue: 0, totalValue: 0 };
      }
      regionData[item.region].count += 1;
      regionData[item.region].totalValue += item.value;
      regionData[item.region].avgValue = regionData[item.region].totalValue / regionData[item.region].count;
    });
    return Object.values(regionData);
  }, [filteredData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4" />
          <p className="text-gray-600">Loading climate data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Database className="h-8 w-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">Climate Information Database</h1>
          </div>
          <p className="text-lg text-gray-600">
            Search and explore comprehensive climate data across Nigeria with advanced filtering and visualization tools.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          {/* Search bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by region, hazard type, data type, or source..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                className="pl-10 form-input"
              />
            </div>
          </div>

          {/* Filter controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
              <select
                value={filters.region}
                onChange={(e) => handleFilterChange('region', e.target.value)}
                className="form-select"
              >
                <option value="">All Regions</option>
                {filterOptions.regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hazard Type</label>
              <select
                value={filters.hazardType}
                onChange={(e) => handleFilterChange('hazardType', e.target.value)}
                className="form-select"
              >
                <option value="">All Hazards</option>
                {filterOptions.hazardTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Type</label>
              <select
                value={filters.dataType}
                onChange={(e) => handleFilterChange('dataType', e.target.value)}
                className="form-select"
              >
                <option value="">All Data Types</option>
                {filterOptions.dataTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
              <select
                value={filters.timePeriod}
                onChange={(e) => handleFilterChange('timePeriod', e.target.value)}
                className="form-select"
              >
                <option value="">All Periods</option>
                {filterOptions.timePeriods.map(period => (
                  <option key={period} value={period}>{period}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
              <select
                value={filters.source}
                onChange={(e) => handleFilterChange('source', e.target.value)}
                className="form-select"
              >
                <option value="">All Sources</option>
                {filterOptions.sources.map(source => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <button
                onClick={clearFilters}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                <Filter className="h-4 w-4" />
                <span>Clear Filters</span>
              </button>
              <span className="text-sm text-gray-600">
                {filteredData.length} of {data.length} records
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={exportToCSV}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200"
              >
                <Download className="h-4 w-4" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={exportToJSON}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-secondary-600 hover:bg-secondary-700 rounded-lg transition-colors duration-200"
              >
                <Download className="h-4 w-4" />
                <span>Export JSON</span>
              </button>
            </div>
          </div>
        </div>

        {/* Data visualization */}
        {filteredData.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <BarChart3 className="h-5 w-5 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900">Data Overview</h2>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#22c55e" name="Data Points" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Data table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Climate Data Records</h2>
          </div>
          
          {filteredData.length === 0 ? (
            <div className="text-center py-12">
              <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No data found matching your criteria.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Region</th>
                      <th>Hazard Type</th>
                      <th>Data Type</th>
                      <th>Value</th>
                      <th>Time Period</th>
                      <th>Source</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span>{item.region}</span>
                          </div>
                        </td>
                        <td>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {item.hazard_type}
                          </span>
                        </td>
                        <td>{item.data_type}</td>
                        <td>
                          <span className="font-medium">{item.value}</span>
                          <span className="text-gray-500 ml-1">{item.unit}</span>
                        </td>
                        <td>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span>{item.time_period}</span>
                          </div>
                        </td>
                        <td>{item.source}</td>
                        <td>
                          <button
                            onClick={() => {
                              setSelectedItem(item);
                              setShowPreview(true);
                            }}
                            className="flex items-center space-x-1 px-2 py-1 text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded transition-colors duration-200"
                          >
                            <Eye className="h-4 w-4" />
                            <span>View</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} results
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors duration-200"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors duration-200"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Data preview modal */}
        {showPreview && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Data Preview</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <div className="px-6 py-4">
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">ID</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedItem.id}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Region</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedItem.region}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Hazard Type</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedItem.hazard_type}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Data Type</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedItem.data_type}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Value</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedItem.value} {selectedItem.unit}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Time Period</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedItem.time_period}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Source</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedItem.source}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedItem.last_updated}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Coordinates</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      Lat: {selectedItem.coordinates.lat}, Lng: {selectedItem.coordinates.lng}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClimateDatabase;