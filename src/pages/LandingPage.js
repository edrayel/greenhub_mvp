import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Database, 
  Map, 
  BarChart3, 
  BookOpen, 
  Users, 
  Globe, 
  Shield, 
  TrendingUp,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

/**
 * Landing page component with hero section, features, and statistics
 * @returns {React.Component} Landing page component
 */
const LandingPage = () => {
  const { isAuthenticated, hasAnyRole } = useAuth();

  /**
   * Key statistics for the platform
   */
  const stats = [
    {
      icon: Database,
      value: '10,000+',
      label: 'Climate Data Points',
      description: 'Comprehensive climate data across Nigeria'
    },
    {
      icon: Map,
      value: '36',
      label: 'States Covered',
      description: 'Complete coverage of all Nigerian states'
    },
    {
      icon: Users,
      value: '500+',
      label: 'Active Users',
      description: 'Government officials, researchers, and stakeholders'
    },
    {
      icon: BarChart3,
      value: '45',
      label: 'Active Projects',
      description: 'Ongoing climate adaptation initiatives'
    }
  ];

  /**
   * Platform features
   */
  const features = [
    {
      icon: Database,
      title: 'Climate Information Database',
      description: 'Access comprehensive climate data with advanced search and filtering capabilities.',
      link: '/climate-database',
      roles: ['researcher', 'government', 'admin']
    },
    {
      icon: Map,
      title: 'Vulnerability Mapping',
      description: 'Interactive maps showing climate risks and vulnerability assessments across Nigeria.',
      link: '/vulnerability-maps',
      roles: ['researcher', 'government', 'admin']
    },
    {
      icon: BarChart3,
      title: 'M&E Dashboard',
      description: 'Monitor and evaluate National Adaptation Plan progress with real-time dashboards.',
      link: '/me-dashboard',
      roles: ['government', 'admin']
    },
    {
      icon: BookOpen,
      title: 'Resource Library',
      description: 'Access policy documents, best practices, and educational materials.',
      link: '/resources',
      roles: ['public', 'researcher', 'government', 'admin']
    }
  ];

  /**
   * Check if user can access a feature
   * @param {Array} requiredRoles - Required roles for the feature
   * @returns {boolean} Whether user can access the feature
   */
  const canAccessFeature = (requiredRoles) => {
    if (requiredRoles.includes('public')) return true;
    return isAuthenticated && hasAnyRole(requiredRoles);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              GreenHub
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Digital platform supporting Nigeria's National Adaptation Plan (NAP) process
            </p>
            <p className="text-lg mb-10 max-w-2xl mx-auto opacity-90">
              Empowering climate adaptation through data-driven insights, vulnerability mapping, 
              and collaborative monitoring for a resilient Nigeria.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link
                  to={hasAnyRole(['researcher', 'government', 'admin']) ? '/climate-database' : '/resources'}
                  className="inline-flex items-center px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  Explore Platform
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="inline-flex items-center px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    to="/resources"
                    className="inline-flex items-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-colors duration-200"
                  >
                    View Resources
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Platform Impact
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Supporting Nigeria's climate adaptation efforts with comprehensive data and tools
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="stats-card text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-lg mb-4">
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-lg font-semibold text-gray-700 mb-2">
                    {stat.label}
                  </div>
                  <div className="text-sm text-gray-600">
                    {stat.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Platform Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools for climate data analysis, risk assessment, and adaptation planning
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              const canAccess = canAccessFeature(feature.roles);
              
              return (
                <div key={index} className="card-hover bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-lg">
                        <IconComponent className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {feature.description}
                      </p>
                      {canAccess ? (
                        <Link
                          to={feature.link}
                          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                        >
                          Explore Feature
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      ) : (
                        <div className="text-sm text-gray-500">
                          {!isAuthenticated ? 'Login required' : 'Access restricted'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose GreenHub?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built specifically for Nigeria's climate adaptation needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
                <Globe className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Comprehensive Coverage
              </h3>
              <p className="text-gray-600">
                Complete climate data coverage across all 36 states of Nigeria with regular updates.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Reliable & Secure
              </h3>
              <p className="text-gray-600">
                Built with security best practices and reliable data sources from trusted institutions.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 text-purple-600 rounded-full mb-4">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Evidence-Based
              </h3>
              <p className="text-gray-600">
                Make informed decisions with data-driven insights and scientific projections.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      {!isAuthenticated && (
        <section className="py-16 bg-primary-600 text-white">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8">
              Join government officials, researchers, and stakeholders in building a climate-resilient Nigeria.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Access Platform
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default LandingPage;