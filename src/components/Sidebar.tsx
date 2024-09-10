import React from 'react';
import { Link } from 'react-router-dom';
import './components.css';

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <Link to="/" className="custom-button">Home</Link>
      <Link to="/clients" className="custom-button">Clients</Link>
      <Link to="/cocktails" className="custom-button">Cocktails</Link>
      <Link to="/supplements" className="custom-button">Supplements</Link>
      <Link to="/settings" className="custom-button">Settings</Link>

      <div className="logout-container">
        <button
          className="custom-button logout-button"
          onClick={() => alert("Logged out!")} // Temporary logout function
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

