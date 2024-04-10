import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LogInPage from './pages/LogInPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SignUpPage from './pages/SignUpPage';
import SubmitDetailsPage from './pages/SubmitDetailsPage';
import MarketMakerDashboardPage from './pages/MarketMakerDashboardPage';
import ClientDashboardPage from './pages/ClientDashboardPage';
import { auth } from './firebase'; // Import Firebase auth instance

const ProtectedRoute = ({ element: Element, ...rest }) => {
  const user = auth.currentUser; // Get current user

  // If user is not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" />;
  }
  return <Element {...rest} />;
};

ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="login" element={<LogInPage />} />
      <Route path="reset-password" element={<ResetPasswordPage />} />
      <Route path="sign-up" element={<SignUpPage />} />
      <Route path="submit-details" element={<SubmitDetailsPage />} />
      <Route path="mm-dashboard" element={<ProtectedRoute element={MarketMakerDashboardPage} />} />
      <Route path="client" element={<ProtectedRoute element={ClientDashboardPage} />} />
    </Routes>
  </Router>,
  document.getElementById('root')
);
