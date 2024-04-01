import React from 'react';
import './Home.css'; // Importing CSS file for styling

function Home() {
  // Retrieve user information from local storage
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="home-container">
      <div className="home-content">
        <h2>Welcome, {user && user.email}!</h2>
        <p>This is the home page where you can find important information.</p>
        <p>Please take some time to read through the content.</p>
      </div>
    </div>
  );
}

export default Home;
