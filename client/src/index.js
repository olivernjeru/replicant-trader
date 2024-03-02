import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LogInPage from './pages/LogInPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ResetPasswordPromptPage from './pages/ResetPasswordPromptPage';
import RegisterPage from './pages/RegisterPage';
import MarketMakerDashboardPage from './pages/MarketMakerDashboardPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "login",
    element: <LogInPage />
  },
  {
    path: "reset-password",
    element: <ResetPasswordPage />
  },
  {
    path: "reset-password-prompt",
    element: <ResetPasswordPromptPage />
  },
  {
    path: "register",
    element: <RegisterPage />
  },
  {
    path: "mm-dashboard",
    element: <MarketMakerDashboardPage />
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
