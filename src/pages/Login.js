import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Eye, EyeOff, Leaf, AlertCircle } from 'lucide-react';

/**
 * Login page component with form validation and role-based redirection
 * @returns {React.Component} Login page component
 */
const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  /**
   * Handle input changes
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.username, formData.password);
      
      if (result.success) {
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Demo user accounts for testing
   */
  const demoAccounts = [
    {
      role: 'Administrator',
      username: 'admin@dcc.gov.ng',
      password: 'admin123',
      description: 'Full access to all features'
    },
    {
      role: 'Government Official',
      username: 'gov.official@climate.gov.ng',
      password: 'gov123',
      description: 'Access to all tools and M&E dashboard'
    },
    {
      role: 'Researcher',
      username: 'researcher@unilag.edu.ng',
      password: 'research123',
      description: 'Access to database and mapping tools'
    },
    {
      role: 'Public User',
      username: 'public.user@gmail.com',
      password: 'public123',
      description: 'Access to public resources only'
    }
  ];

  /**
   * Fill form with demo account credentials
   * @param {string} username - Demo username
   * @param {string} password - Demo password
   */
  const fillDemoAccount = (username, password) => {
    setFormData({ username, password });
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo and title */}
        <div className="flex justify-center">
          <div className="bg-primary-600 p-3 rounded-lg">
            <Leaf className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Sign in to GreenHub
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Access Nigeria's climate adaptation platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Login form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Username field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username / Email
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter your username or email"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? (
                  <div className="loading-spinner w-5 h-5" />
                ) : (
                  <>
                    <LogIn className="h-5 w-5 mr-2" />
                    Sign in
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Demo accounts section */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Demo Accounts</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {demoAccounts.map((account, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {account.role}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {account.description}
                      </p>
                      <div className="text-xs text-gray-400 mt-1">
                        {account.username}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => fillDemoAccount(account.username, account.password)}
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition-colors duration-200"
                    >
                      Use Account
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Back to home link */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-sm text-primary-600 hover:text-primary-500"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;