import React, { useState } from 'react';
import "./CreateUser.css";

function CreateUser() {
  const [showPopup, setShowPopup] = useState(false);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordOption, setPasswordOption] = useState('default'); // State to track password option
  const [passwordVisible, setPasswordVisible] = useState(false); // State to track password visibility
  const [role, setRole] = useState('Admin'); // Default role as Admin

  // Function to generate a random password
  const generateRandomPassword = (length) => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let generatedPassword = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      generatedPassword += charset[randomIndex];
    }
    return generatedPassword;
  };


  // Function to handle password option change
  const handlePasswordOptionChange = (e) => {
    setPasswordOption(e.target.value);
    // If default password is selected, generate a random password
    if (e.target.value === 'default') {
      const defaultPassword = generateRandomPassword(10); // Generate a 10-character password
      setPassword(defaultPassword);
    } else {
      setPassword(''); // Clear password if custom password is selected
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleCreateUser = async () => {
    // Prepare user data based on the selected role
    const userData = role === 'Admin' ? { email, password } : { firstname, lastname, email, password };
  
    // Determine the endpoint based on the role
    const endpoint = role === 'Admin' ? 'admin' : 'user';

    try {
        // Make a POST request to the server to add the user data
        const response = await fetch(`http://localhost:5000/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (response.ok) {
            // User data added successfully
            console.log(`User data added successfully for role: ${role}`);

            // Send email to the user
            const emailResponse = await fetch(`http://localhost:5000/send-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password , link: 'http://localhost:3000/changepassword'})
            });

            if (emailResponse.ok) {
                console.log('Email sent successfully to:', email);
            } else {
                console.error('Failed to send email:', emailResponse.statusText);
            }
            } else {
                // Error handling
                console.error('Failed to add user data:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding user data:', error);
        } finally {
            // Close the popup
            setShowPopup(false);
        }
    };

  


  return (
    <div className="app">
      <button onClick={() => setShowPopup(true)}>Create User</button>
      {showPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h2>Create User</h2>
            <label>Firstname:</label>
            <input type="text" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
            <label>Lastname:</label>
            <input type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} />
            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <label>Password Option:</label>
            <select value={passwordOption} onChange={handlePasswordOptionChange}>
              <option value="default">Default Password</option>
              <option value="custom">Custom Password</option>
            </select>
            {passwordOption === 'custom' && (
              <div>
                <label>Password:</label>
                <div className="password-input">
                  <input
                    type={passwordVisible ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button onClick={togglePasswordVisibility}>
                    {passwordVisible ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
            )}
            <label>Role:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
            <div className="popup-buttons">
              <button onClick={handleCreateUser}>Create User</button>
              <button onClick={() => setShowPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateUser;
