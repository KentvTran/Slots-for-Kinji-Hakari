import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './components/WelcomePage/WelcomePage';
import Leaderboards from './components/Leaderboards/Leaderboards';
import LoginPage from './components/LoginPage/LoginPage';
import Shop from './components/Shop/Shop';
import Layout from './components/Layout/Layout';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/leaderboards" element={<Leaderboards />} />
          <Route path="/login-page" element={<LoginPage />} />
          <Route path="/shop" element={<Shop />} />  {/* ✅ Added Shop Route */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
