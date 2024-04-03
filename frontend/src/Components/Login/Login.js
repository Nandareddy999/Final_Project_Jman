import React, { useState } from 'react';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput
} from 'mdb-react-ui-kit';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminPage from '../AdminPage/AdminPage';
import UserPage from '../UserPage/UserPage';
import ForgetPassword from "../ForgetPassword/ForgetPassword";
import "./Login.css";


function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user'
  });

  const [loggedIn, setLoggedIn] = useState(false);
  const [userFound, setUserFound] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/${formData.role}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const userData = await response.json();

      if (response.status === 200) {
        setLoggedIn(true);
        setUserFound(true);
        localStorage.setItem('user', JSON.stringify(formData));
      } else {
        alert('Invalid email or password');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while logging in');
    }
  };

  if (loggedIn && userFound && formData.role === 'admin') {
    return <AdminPage />;
  } else if (loggedIn && userFound && formData.role === 'user') {
    return <UserPage />;
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

            <form onSubmit={handleSubmit}>
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

              <div className="mb-3">
                <label className="form-label">Select Role:</label>
                <select className="form-select" name="role" value={formData.role} onChange={handleChange}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="text-center pt-1 mb-5 pb-1">
                <button type="submit" className="mb-4 p-2 w-100 gradient-custom-2">Sign in</button>
                <a href="/forget-password" className="text-muted">Forgot password?</a>
              </div>
            </form>
          </div>
        </MDBCol>

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
