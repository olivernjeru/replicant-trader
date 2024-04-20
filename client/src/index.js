import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LogInPage from './pages/LogInPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SignUpPage from './pages/SignUpPage';
import SubmitDetailsPage from './pages/SubmitDetailsPage';
import MarketMakerDashboardPage from './pages/MarketMakerDashboardPage';
import ClientDashboardPage from './pages/ClientDashboardPage';
import { auth } from './firebase'; // Import Firebase auth instance

const PrivateRoutes = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    // Clean up function to unsubscribe when component unmounts
    return unsubscribe;
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator while checking authentication state
  }

  // If user is not logged in, redirect to login page
  if (!user) {
    return <Navigate to="login" />;
  }

  // If user is logged in, render the protected routes
  return <Outlet />;
};

ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="login" element={<LogInPage />} />
      <Route path="reset-password" element={<ResetPasswordPage />} />
      <Route path="sign-up" element={<SignUpPage />} />
      <Route path="submit-details" element={<SubmitDetailsPage />} />
      <Route element={<PrivateRoutes />}>
        <Route path='mm-dashboard' element={<MarketMakerDashboardPage />} />
        <Route path='client' element={<ClientDashboardPage />} />
      </Route>
    </Routes>
  </Router>,
  document.getElementById('root')
);
