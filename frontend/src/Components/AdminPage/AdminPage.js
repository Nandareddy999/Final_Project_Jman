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
                    <MDBNavbarLink className="navbar-link" active={selectedOption === 'create-user'} onClick={() => handleOptionClick('create-user')}>
                      Create User
                    </MDBNavbarLink>
                  </MDBNavbarItem>
                  <MDBNavbarItem>
                    <MDBNavbarLink className="navbar-link" active={selectedOption === 'feedback'} onClick={() => handleOptionClick('feedback')}>
                      Feedback
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

export default AdminPage;
