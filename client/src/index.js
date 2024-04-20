import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogInPage from './pages/LogInPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SignUpPage from './pages/SignUpPage';
import SubmitDetailsPage from './pages/SubmitDetailsPage';
import MarketMakerDashboardPage from './pages/MarketMakerDashboardPage';
import ClientDashboardPage from './pages/ClientDashboardPage';
import PrivateRoutes from './components/authentication/privateRoutes/PrivateRoutes';

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
