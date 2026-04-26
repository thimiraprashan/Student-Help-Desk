import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Events from './pages/Events';
import Sports from './pages/Sports';
import Clubs from './pages/Clubs';
import Notifications from './pages/Notifications';
import QualityAssurance from './pages/QualityAssurance';

import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="events" element={<Events />} />
          <Route path="sports" element={<Sports />} />
          <Route path="clubs" element={<Clubs />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="testing" element={<QualityAssurance />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
