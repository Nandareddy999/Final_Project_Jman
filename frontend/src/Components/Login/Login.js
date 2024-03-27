import React, { useState } from 'react';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput
} from 'mdb-react-ui-kit';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navigate } from 'react-router-dom'; 
import CreateUser from '../CreateUser/CreateUser';
import "./Login.css";

function Login() {
  // State to hold form data
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // State to track successful login
  const [loggedIn, setLoggedIn] = useState(false);

  // Function to handle changes in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Update formData state with the new value
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Your validation logic and form submission code here
    console.log('Form submitted:', formData);
    // Check if admin credentials are entered (example)
    if (formData.email === 'admin@example.com' && formData.password === 'admin123') {
      // Set loggedIn to true
      setLoggedIn(true);
    } else {
      // Handle incorrect credentials
      alert('Invalid email or password');
    }
  };

  // If logged in, navigate to '/create-user'
  if (loggedIn) {
    return <CreateUser />;
  }

  return (
    <MDBContainer className="my-5 gradient-form">
      <MDBRow>
        <MDBCol col='6' className="mb-5">
          <div className="d-flex flex-column ms-5">
            <div className="text-center">
              <img className='logo' src="https://th.bing.com/th?id=OIP.e1KNYwnuhNwNj7_-98yTRwHaF7&pid=ImgDet&w=1200" alt="logo" style={{ width: '185px' }} />
              <h4 className="mt-1 mb-5 pb-1">We are Working as a Team</h4>
            </div>
            <p>Please login to your account</p>

            {/* Form starts here */}
            <form onSubmit={handleSubmit}>
              {/* Email input */}
              <label className='mb-2'>Email address</label>
              <MDBInput
                wrapperClass='mb-1'
                id='form1'
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                placeholder='Enter your Email'
                required
              />

              {/* Password input */}
              <label className='mb-2'>Password</label>
              <MDBInput
                wrapperClass='mb-1'
                id='form2'
                type='password'
                name='password'
                value={formData.password}
                onChange={handleChange}
                placeholder='Enter your Password'
                required
              />

              {/* Sign in button */}
              <div className="text-center pt-1 mb-5 pb-1">
                <button type="submit" className="mb-4 p-2 w-100 gradient-custom-2">Sign in</button>
                <a className="text-muted" href="#!">Forgot password?</a>
              </div>
            </form>
            {/* Form ends here */}
          </div>
        </MDBCol>

        {/* Right column */}
        <MDBCol col='6' className="mb-5">
          <div className="d-flex flex-column  justify-content-center gradient-custom-2 h-100 mb-4">
            <div className="text-white px-3 py-4 p-md-5 mx-md-4">
              <h4 className="mb-4">We are more than just a company</h4>
              <p className="small mb-0">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Login;
