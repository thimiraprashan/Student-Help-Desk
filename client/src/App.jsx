import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Events from './pages/Events';
import Sports from './pages/Sports';
import Clubs from './pages/Clubs';
import Notifications from './pages/Notifications';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="events" element={<Events />} />
          <Route path="sports" element={<Sports />} />
          <Route path="clubs" element={<Clubs />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
