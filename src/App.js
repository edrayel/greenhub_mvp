import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components
import Navbar from './components/Navbar';
import SecondaryNav from './components/SecondaryNav';
import LandingPage from './pages/LandingPage';
import ClimateDatabase from './pages/ClimateDatabase';
import VulnerabilityMaps from './pages/VulnerabilityMaps';
import MEDashboard from './pages/MEDashboard';
import InformationSharing from './pages/InformationSharing';
import Login from './pages/Login';
import About from './pages/About';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';

/**
 * ProtectedRoute component for role-based access control
 * @param {Object} props - Component props
 * @param {React.Component} props.children - Child components to render
 * @param {Array} props.allowedRoles - Array of roles allowed to access this route
 * @returns {React.Component} Protected route component
 */
function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

/**
 * Main content wrapper that adjusts padding based on authentication state
 * @returns {React.Component} Main content wrapper
 */
function MainContent() {
  const { isAuthenticated, hasAnyRole } = useAuth();
  
  // Determine if SecondaryNav is visible
  const hasSecondaryNav = isAuthenticated && hasAnyRole(['researcher', 'government', 'admin']);
  
  // Adjust padding based on SecondaryNav visibility
  const mainPadding = hasSecondaryNav ? '11.5rem' : '4rem';
  
  return (
    <main style={{paddingTop: mainPadding}}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/about" element={<About />} />
              
              {/* Public access to resources */}
              <Route path="/resources" element={<InformationSharing />} />
              
              {/* Protected Routes - Researchers and Government */}
              <Route 
                path="/climate-database" 
                element={
                  <ProtectedRoute allowedRoles={['researcher', 'government', 'admin']}>
                    <ClimateDatabase />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/vulnerability-maps" 
                element={
                  <ProtectedRoute allowedRoles={['researcher', 'government', 'admin']}>
                    <VulnerabilityMaps />
                  </ProtectedRoute>
                } 
              />
              
              {/* Government and Admin only */}
              <Route 
                path="/me-dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['government', 'admin']}>
                    <MEDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
    </main>
  );
}

/**
 * Main App component with routing and authentication
 * @returns {React.Component} Main application component
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App min-h-screen bg-gray-50">
          <Navbar />
          <SecondaryNav />
          <MainContent />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;