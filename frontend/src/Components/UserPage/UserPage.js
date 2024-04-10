import React, { useState } from 'react';
import './UserPage.css';
import Profile from '../Profile/Profile';
import Timesheet from '../Timesheet/Timesheet';
import Home from '../Home/Home';
import GiveFeedback from '../Give Feedback/GiveFeedback';
import Login from "../Login/Login";
import GeneralFeedback from '../General Feedback/GeneralFeedback';

function UserPage() {
  const [openNavSecond, setOpenNavSecond] = useState(false);
  const [selectedOption, setSelectedOption] = useState('home'); // Set initial value to 'home'
  const [loggedIn, setLoggedIn] = useState(true); // Set initial value to true, assuming the user is initially logged in

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
      case 'GiveFeedback':
        return <GiveFeedback />;
      case 'GeneralFeedback':
        return <GeneralFeedback />;
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
              <button
                className="navbar-toggler"
                type="button"
                onClick={() => setOpenNavSecond(!openNavSecond)}
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div
                className={`collapse navbar-collapse ${openNavSecond ? 'show' : ''}`}
              >
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <button
                      className={`nav-link btn ${selectedOption === 'home' ? 'active' : ''}`}
                      onClick={() => handleOptionClick('home')}
                    >
                      Home
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link btn ${selectedOption === 'timesheet' ? 'active' : ''}`}
                      onClick={() => handleOptionClick('timesheet')}
                    >
                      Timesheet
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link btn ${selectedOption === 'GiveFeedback' ? 'active' : ''}`}
                      onClick={() => handleOptionClick('GiveFeedback')}
                    >
                      Give Feedback
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link btn ${selectedOption === 'GeneralFeedback' ? 'active' : ''}`}
                      onClick={() => handleOptionClick('GeneralFeedback')}
                    >
                      General Feedback
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link btn ${selectedOption === 'profile' ? 'active' : ''}`}
                      onClick={() => handleOptionClick('profile')}
                    >
                      Profile
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link btn"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
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

export default UserPage;
