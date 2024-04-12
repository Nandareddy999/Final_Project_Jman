import React from 'react';
import './Home.css'; // Importing CSS file for styling

function Home() {
  // Retrieve user information from local storage
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="home-container">
      <div className="home-content">
        <h2>Welcome, {user && user.email}!</h2>
        <p>Welcome to our innovative hub where creativity thrives, and possibilities abound. <br/>
          With a relentless commitment to excellence, we craft solutions that redefine industries and shape the future. <br/>
          Our diverse team of visionaries collaborates seamlessly to push boundaries and exceed expectations. 
          <br/>From cutting-edge technology to unparalleled customer service, we're dedicated to empowering our partners and driving success. 
          <br/><br/>Join us on this journey of innovation and discovery. Together, let's unlock new horizons and make an impact that resonates globally.
        </p>
      </div>
    </div>
  );
}

export default Home;
