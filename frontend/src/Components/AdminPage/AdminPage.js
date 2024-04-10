import React, { useState } from 'react';
import { MDBContainer, MDBNavbar, MDBNavbarToggler, MDBNavbarNav, MDBNavbarItem, MDBNavbarLink, MDBIcon, MDBCollapse } from 'mdb-react-ui-kit';
import Feedback from '../Feedback/Feedback';
import CreateUser from '../CreateUser/CreateUser';
import './AdminPage.css';
import Profile from '../Profile/Profile';
import Timesheet from '../Timesheet/Timesheet';
import Login from "../Login/Login";
import Home from '../Home/Home';

function AdminPage() {
  const [openNavSecond, setOpenNavSecond] = useState(false);
  const [selectedOption, setSelectedOption] = useState('home'); // Set initial value to 'home'
  const [loggedIn, setLoggedIn] = useState(true);
  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setOpenNavSecond(false); // Close the navbar when an option is selected
  };

  const handleLogout = () => {
    // Perform logout actions here, such as clearing local storage, etc.
    setLoggedIn(false); // Update loggedIn state to false
  };

  const renderComponent = () => {
    switch (selectedOption) {
      case 'home':
        return <Home />;
      case 'create-user':
        return <CreateUser />;
      case 'feedback':
        return <Feedback />;
      case 'timesheet':
        return <Timesheet />;
      case 'profile':
        return <Profile />;
      default:
        return null;
    }
  };
  
  if (!loggedIn) {
    return <Login />;
  }

  return (
    <div>
      <div className="navbar-top">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <a className={"nav-link" + (selectedOption === 'home' ? " active" : "")} href="#" onClick={() => handleOptionClick('home')}>Home</a>
                </li>
                <li className="nav-item">
                  <a className={"nav-link" + (selectedOption === 'create-user' ? " active" : "")} href="#" onClick={() => handleOptionClick('create-user')}>Create User</a>
                </li>
                <li className="nav-item">
                  <a className={"nav-link" + (selectedOption === 'feedback' ? " active" : "")} href="#" onClick={() => handleOptionClick('feedback')}>Feedback</a>
                </li>
                <li className="nav-item">
                  <a className={"nav-link" + (selectedOption === 'timesheet' ? " active" : "")} href="#" onClick={() => handleOptionClick('timesheet')}>Timesheet</a>
                </li>
                <li className="nav-item">
                  <a className={"nav-link" + (selectedOption === 'profile' ? " active" : "")} href="#" onClick={() => handleOptionClick('profile')}>Profile</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#" onClick={handleLogout}>Logout</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
      
      <div>
        {renderComponent()}
      </div>
    </div>
  );
}

export default AdminPage;
