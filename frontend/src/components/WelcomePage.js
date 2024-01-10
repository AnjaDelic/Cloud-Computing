// src/components/WelcomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './styles/NavigationLinks.css';

const WelcomePage = () => {
  return (
    <div>
      <h2>Welcome to Our Library</h2>
      <p>Explore and enjoy our collection of books!</p>
      
      {/* Add links to other pages */}
      <Link to="/addBook" className="nav-link">Add a Book</Link>
      <Link to="/borrow" className="nav-link">Borrow a Book</Link>
      <Link to="/returnBook" className="nav-link">Return a Book</Link>
    </div>
  );
};

export default WelcomePage;
