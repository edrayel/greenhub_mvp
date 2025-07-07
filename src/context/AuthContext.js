import React, { createContext, useContext, useState, useEffect } from 'react';
import usersData from '../data/users.json';

const AuthContext = createContext();

/**
 * Custom hook to use the authentication context
 * @returns {Object} Authentication context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Authentication provider component
 * Manages user authentication state and provides login/logout functionality
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {React.Component} Authentication provider
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for existing session on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('greenhub_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('greenhub_user');
      }
    }
    setLoading(false);
  }, []);

  /**
   * Login function to authenticate user
   * @param {string} username - User's username/email
   * @param {string} password - User's password
   * @returns {Object} Login result with success status and message
   */
  const login = async (username, password) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user in mock data
      const foundUser = usersData.users.find(
        u => u.username === username && u.password === password
      );

      if (foundUser) {
        // Remove password from user object before storing
        const { password: _, ...userWithoutPassword } = foundUser;
        
        // Update last login time
        const userWithLastLogin = {
          ...userWithoutPassword,
          last_login: new Date().toISOString()
        };

        setUser(userWithLastLogin);
        setIsAuthenticated(true);
        
        // Save to localStorage for persistence
        localStorage.setItem('greenhub_user', JSON.stringify(userWithLastLogin));
        
        return {
          success: true,
          message: 'Login successful',
          user: userWithLastLogin
        };
      } else {
        return {
          success: false,
          message: 'Invalid username or password'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'An error occurred during login'
      };
    }
  };

  /**
   * Logout function to clear user session
   */
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('greenhub_user');
  };

  /**
   * Check if user has specific role
   * @param {string} role - Role to check
   * @returns {boolean} Whether user has the specified role
   */
  const hasRole = (role) => {
    return user?.role === role;
  };

  /**
   * Check if user has any of the specified roles
   * @param {Array<string>} roles - Array of roles to check
   * @returns {boolean} Whether user has any of the specified roles
   */
  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };

  /**
   * Get user's display name
   * @returns {string} User's display name
   */
  const getUserDisplayName = () => {
    return user?.name || user?.username || 'User';
  };

  /**
   * Get user's role display name
   * @returns {string} Formatted role name
   */
  const getRoleDisplayName = () => {
    const roleMap = {
      admin: 'Administrator',
      government: 'Government Official',
      researcher: 'Researcher',
      public: 'Public User'
    };
    return roleMap[user?.role] || 'User';
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    hasRole,
    hasAnyRole,
    getUserDisplayName,
    getRoleDisplayName
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};