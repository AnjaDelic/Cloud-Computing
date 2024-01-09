import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import MembersList from './components/MembersList';
import RegisterMember from './components/RegisterMember';
import BorrowBook from './components/BorrowBook';
import AddBook from './components/AddBook';
import WelcomePage from './components/WelcomePage';
import './components/styles/NavigationLinks.css';

const App = () => {
  return (
    <Router>
      <div>
        {/* Navigation links */}
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/register" className="nav-link">Register Member</Link>
        <Link to="/members" className="nav-link">Member List</Link>
        <Link to="/borrow" className="nav-link">Borrow Book</Link>
        <Link to="/addBook" className="nav-link">Add Book</Link>

        {/* Routes */}
        <Switch>
          <Route path="/register" component={RegisterMember} />
          <Route path="/members" component={MembersList} />
          <Route path="/borrow" component={BorrowBook} />
          <Route path="/addBook" component={AddBook} />
          <Route path="/" exact component={WelcomePage} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
