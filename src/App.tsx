import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Clients from './pages/Clients';
import Cocktails from './pages/Cocktails';
import Supplements from './pages/Supplements';
import Settings from './pages/Settings';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import './App.css';
import { initialize, selectAppReady } from './pages/authSlice';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const appReady = useSelector(selectAppReady);

  useEffect(() => {
    dispatch(initialize());
  }, [dispatch]);

  if (!appReady) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="container-fluid p-0">
        <Header />
        <div className="d-flex">
          <Sidebar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/cocktails" element={<Cocktails />} />
              <Route path="/supplements" element={<Supplements />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;