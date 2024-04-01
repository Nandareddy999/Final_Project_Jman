import React, { useState } from 'react';
import { MDBContainer, MDBNavbar, MDBNavbarToggler, MDBNavbarNav, MDBNavbarItem, MDBNavbarLink, MDBIcon, MDBCollapse } from 'mdb-react-ui-kit';
import './UserPage.css';
import Profile from '../Profile/Profile';
import Timesheet from '../Timesheet/Timesheet';
import Home from '../Home/Home';
import GiveFeedback from '../Give Feedback/GiveFeedback';
import GeneralFeedback from '../General Feedback/GeneralFeedback';

function UserPage() {
  const [openNavSecond, setOpenNavSecond] = useState(false);
  const [selectedOption, setSelectedOption] = useState('home'); // Set initial value to 'home'

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setOpenNavSecond(false); // Close the navbar when an option is selected
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
                    <MDBNavbarLink className="navbar-link" active={selectedOption === 'timesheet'} onClick={() => handleOptionClick('timesheet')}>
                      Timesheet
                    </MDBNavbarLink>
                  </MDBNavbarItem>
                  <MDBNavbarItem>
                    <MDBNavbarLink className="navbar-link" active={selectedOption === 'profile'} onClick={() => handleOptionClick('profile')}>
                      Profile
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
