import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css'; // Import your custom CSS file

function Profile() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Retrieve user email from localStorage
        const userData = JSON.parse(localStorage.getItem('user'));
        const userEmail = userData ? userData.email : null;
        console.log("User email:", userEmail);

        if (userEmail === "admin@example.com") {
            // If the user is admin, set the user object with predefined values
            setUser({
                email: "admin@example.com",
                firstname: "Admin",
                lastname: "Admin",
                role: "admin"
            });
        } else {
            // Otherwise, fetch user profile from the server
            axios.get(`http://localhost:5000/userEmail`, {params: {email: userEmail}})
                .then(response => {
                    console.log(response.data);
                    setUser(response.data);
                })
                .catch(error => {
                    console.error('Error fetching user profile:', error);
                });
        }
    }, []);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container profile-page">
            <h1>User Profile</h1>
            <div className="profile-info">
                <div className="profile-item">First Name: {user.firstname}</div>
                <div className="profile-item">Last Name: {user.lastname}</div>
                <div className="profile-item">Email: {user.email}</div>
                <div className="profile-item">Role: {user.role}</div>
            </div>
        </div>
    );
}

export default Profile;
