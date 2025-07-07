import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Database, 
  Map, 
  BarChart3
} from 'lucide-react';

/**
 * Secondary navigation bar component for platform tools
 * Displays climate database, vulnerability maps, and M&E dashboard
 * @returns {React.Component} Secondary navigation component
 */
const SecondaryNav = () => {
  const { isAuthenticated, hasAnyRole } = useAuth();
  const location = useLocation();

  /**
   * Check if current path matches the given path
   * @param {string} path - Path to check
   * @returns {boolean} Whether current path matches
   */
  const isActivePath = (path) => {
    return location.pathname === path;
  };

  /**
   * Get platform tool menu items based on user role
   * @returns {Array} Array of menu items
   */
  const getPlatformTools = () => {
    if (!isAuthenticated) {
      return [];
    }

    const tools = [];

    // Add items for researchers and government officials
    if (hasAnyRole(['researcher', 'government', 'admin'])) {
      tools.push(
        { path: '/climate-database', label: 'Climate Database', icon: Database, description: 'Access climate data and analytics' },
        { path: '/vulnerability-maps', label: 'Vulnerability Maps', icon: Map, description: 'View climate risk assessments' }
      );
    }

    // Add M&E Dashboard for government and admin only
    if (hasAnyRole(['government', 'admin'])) {
      tools.push(
        { path: '/me-dashboard', label: 'M&E Dashboard', icon: BarChart3, description: 'Monitor adaptation progress' }
      );
    }

    return tools;
  };

  const platformTools = getPlatformTools();

  // Don't render if no tools available
  if (platformTools.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 border-b border-gray-200 fixed w-full top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
              Platform Tools
            </h2>
          </div>
          
          {/* Desktop view */}
          <div className="hidden md:flex space-x-6">
            {platformTools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <Link
                  key={tool.path}
                  to={tool.path}
                  className={`group flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActivePath(tool.path)
                      ? 'bg-primary-100 text-primary-700 shadow-sm'
                      : 'text-gray-700 hover:bg-white hover:shadow-sm'
                  }`}
                >
                  <div className={`p-2 rounded-md ${
                    isActivePath(tool.path)
                      ? 'bg-primary-200'
                      : 'bg-gray-200 group-hover:bg-primary-100'
                  }`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{tool.label}</div>
                    <div className="text-xs text-gray-500">{tool.description}</div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Mobile view */}
          <div className="md:hidden space-y-2">
            {platformTools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <Link
                  key={tool.path}
                  to={tool.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors duration-200 ${
                    isActivePath(tool.path)
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-white'
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span className="text-sm font-medium">{tool.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecondaryNav;