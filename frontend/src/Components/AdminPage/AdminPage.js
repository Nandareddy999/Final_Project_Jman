import React, { useState } from 'react';
import { MDBContainer, MDBNavbar, MDBNavbarBrand, MDBNavbarToggler, MDBNavbarNav, MDBNavbarItem, MDBNavbarLink, MDBIcon, MDBCollapse } from 'mdb-react-ui-kit';
import Feedback from '../Feedback/Feedback';
import CreateUser from '../CreateUser/CreateUser';
import './AdminPage.css';
import Profile from '../Profile/Profile';

function AdminPage() {
  const [openNavSecond, setOpenNavSecond] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setOpenNavSecond(false); // Close the navbar when an option is selected
  };

  const renderComponent = () => {
    switch (selectedOption) {
      case 'home':
        return <h1>Home</h1>;
      case 'create-user':
        return <CreateUser />;
      case 'feedback':
        return <Feedback />;
      case 'timesheet':
        return <h1>Timesheet</h1>;
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