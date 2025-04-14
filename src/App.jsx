import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './components/WelcomePage/WelcomePage';
import Leaderboards from './components/Leaderboards/Leaderboards';
import LoginPage from './components/LoginPage/LoginPage';
import Shop from './components/Shop/Shop';
import Slots from './components/Slots/Slots';
import Layout from './components/Layout/Layout';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ResetPassword from './components/ResetPassword/ResetPassword';
import NewAccount from './components/NewAccount/NewAccount';
import Settings from './components/Settings/Settings';
import Trade from './components/Trade/Trade';
import { AuthProvider } from './contexts/authContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<WelcomePage />} /> 
            <Route path="/slots" element={<Slots />} />
            <Route path="/leaderboards" element={<Leaderboards />} />
            <Route path="/login-page" element={<LoginPage />} />
            <Route path="/shop" element={<Shop />} /> 
            <Route path="/forgot-password" element={<ForgotPassword />} /> 
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/new-account" element={<NewAccount />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/trade" element={<Trade />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
