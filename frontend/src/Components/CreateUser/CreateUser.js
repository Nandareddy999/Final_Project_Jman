import React, { useState } from 'react';
import "./CreateUser.css";

function CreateUser() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordOption, setPasswordOption] = useState('default');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [role, setRole] = useState('Admin');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const generateRandomPassword = (length) => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let generatedPassword = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      generatedPassword += charset[randomIndex];
    }
    return generatedPassword;
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Define handlePasswordOptionChange function
  const handlePasswordOptionChange = (e) => {
    setPasswordOption(e.target.value);
    if (e.target.value === 'default') {
      const defaultPassword = generateRandomPassword(10);
      setPassword(defaultPassword); // Set the default password
    } else {
      setPassword('');
    }
  };

  const handleCreateUser = async () => {
    setLoading(true);

    // Generate a new default password if the option is set to 'default'
    if (passwordOption === 'default') {
      const defaultPassword = generateRandomPassword(10);
      setPassword(defaultPassword); // Set the default password
    }

    const userData = role === 'Admin' ? { email, password } : { firstname, lastname, email, password, role };
    const endpoint = role === 'Admin' ? 'admin' : 'user';

    try {
      const response = await fetch(`http://localhost:5000/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        setMessage('User added successfully');
        // Send email to the user
        const emailResponse = await fetch(`http://localhost:5000/send-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password, link: 'http://localhost:3000/changepassword' })
        });

        if (emailResponse.ok) {
          console.log('Email sent successfully to:', email);
        } else {
          console.error('Failed to send email:', emailResponse.statusText);
        }
      } else if (response.status === 400) {
        const errorMessage = await response.text();
        setMessage(errorMessage);
      } else {
        console.error('Failed to add user data:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding user data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container createuser">
      <div className="card mt-3 p-3 card-1">
        <h2>Create User</h2>
        {message && <div className={message.startsWith('User added') ? "alert alert-success" : "alert alert-danger"}>{message}</div>}
        <div className="form-group">
          <label>Firstname:</label>
          <input type="text" className="form-control" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Lastname:</label>
          <input type="text" className="form-control" value={lastname} onChange={(e) => setLastname(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Password Option:</label>
          <select className="form-control" value={passwordOption} onChange={handlePasswordOptionChange}>
            <option value="default">Default Password</option>
            <option value="custom">Custom Password</option>
          </select>
        </div>
        {passwordOption === 'custom' && (
          <div className="form-group">
            <label>Password:</label>
            <div className="input-group">
              <input
                type={passwordVisible ? 'text' : 'password'}
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="btn btn-outline-secondary" onClick={togglePasswordVisibility}>
                {passwordVisible ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
        )}
        <div className="form-group">
          <label>Role:</label>
          <select className="form-control" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="Admin">Admin</option>
            <option value="User">User</option>
          </select>
        </div>
        <button className="btn btn-primary" onClick={handleCreateUser} disabled={loading}>
          {loading ? 'Loading...' : 'Create User'}
        </button>
      </div>
    </div>
  );
}

export default CreateUser;