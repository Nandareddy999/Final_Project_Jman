import React, { useState } from 'react';
import { MDBContainer, MDBNavbar, MDBNavbarToggler, MDBNavbarNav, MDBNavbarItem, MDBNavbarLink, MDBIcon, MDBCollapse } from 'mdb-react-ui-kit';
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
        <MDBNavbar expand='lg' light>
          <MDBContainer fluid>
            <MDBNavbarToggler
              aria-expanded='false'
              aria-label='Toggle navigation'
              onClick={() => setOpenNavSecond(!openNavSecond)}
            >
              <MDBIcon icon='bars' fas />
            </MDBNavbarToggler>
            <div>
              <MDBCollapse navbar open={openNavSecond}>
                <MDBNavbarNav>
                  <MDBNavbarItem>
                    <MDBNavbarLink className="navbar-link" active={selectedOption === 'home'} onClick={() => handleOptionClick('home')}>
                      Home
                    </MDBNavbarLink>
                  </MDBNavbarItem>
                  <MDBNavbarItem>
                    <MDBNavbarLink className="navbar-link" active={selectedOption === 'timesheet'} onClick={() => handleOptionClick('timesheet')}>
                      Timesheet
                    </MDBNavbarLink>
                  </MDBNavbarItem>
                  <MDBNavbarItem>
                    <MDBNavbarLink className="navbar-link" active={selectedOption === 'GiveFeedback'} onClick={() => handleOptionClick('GiveFeedback')}>
                      Give Feedback
                    </MDBNavbarLink>
                  </MDBNavbarItem>
                  <MDBNavbarItem>
                    <MDBNavbarLink className="navbar-link" active={selectedOption === 'GeneralFeedback'} onClick={() => handleOptionClick('GeneralFeedback')}>
                      General Feedback 
                    </MDBNavbarLink>
                  </MDBNavbarItem>
                  <MDBNavbarItem>
                    <MDBNavbarLink className="navbar-link" active={selectedOption === 'profile'} onClick={() => handleOptionClick('profile')}>
                      Profile
                    </MDBNavbarLink>
                  </MDBNavbarItem>
                  <MDBNavbarItem>
                    <MDBNavbarLink className="navbar-link" onClick={handleLogout}>
                      Logout
                    </MDBNavbarLink>
                  </MDBNavbarItem>
                </MDBNavbarNav>
              </MDBCollapse>
            </div>
          </MDBContainer>
        </MDBNavbar>
      </div>
      
      <div>
        {renderComponent()}
      </div>
    </div>
  );
}

export default UserPage;
