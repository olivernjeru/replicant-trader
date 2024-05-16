// Index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogInPage from './pages/LogInPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SignUpPage from './pages/SignUpPage';
import MarketMakerDashboardPage from './pages/MarketMakerDashboardPage';
import ClientDashboardPage from './pages/ClientDashboardPage';
import AccountSettingsPage from './pages/AccountSettingsPage';
import AccountProfilePage from './pages/AccountProfilePage';
import PrivateRoutes from './components/authentication/privateRoutes/PrivateRoutes';
import ReversePrivateRoutes from './components/authentication/reversePrivateRoutes/ReversePrivateRoutes';
import { AuthProvider } from './components/authentication/authContext/AuthContext';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Router>
    <AuthProvider>
      <Routes>
        <Route element={<ReversePrivateRoutes />}>
          <Route path="/" element={<App />} />
          <Route path="login" element={<LogInPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
          <Route path="sign-up" element={<SignUpPage />} />
        </Route>
        <Route element={<PrivateRoutes allowedRole="market-maker" />}>
          <Route path='mm-dashboard' element={<MarketMakerDashboardPage />} />
        </Route>
        <Route element={<PrivateRoutes allowedRole="client" />}>
          <Route path='client' element={<ClientDashboardPage />} />
        </Route>
        <Route element={<PrivateRoutes allowedRole="both" />}>
          <Route path='account-settings' element={<AccountSettingsPage />} />
          <Route path='account-profile' element={<AccountProfilePage />} />
        </Route>
      </Routes>
    </AuthProvider>
  </Router>
);
