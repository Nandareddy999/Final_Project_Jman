// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './Profile.css'; // Import your custom CSS file
// import Stack from '@mui/material/Stack';
// import Button from '@mui/material/Button';

// function Profile() {
//     const [user, setUser] = useState(null);

//     useEffect(() => {
//         // Retrieve user email from localStorage
//         const userData = JSON.parse(localStorage.getItem('user'));
//         const userEmail = userData ? userData.email : null;
//         console.log("User email:", userEmail);

//         if (userEmail === "admin@example.com") {
//             // If the user is admin, set the user object with predefined values
//             setUser({
//                 email: "admin@example.com",
//                 firstname: "Admin",
//                 lastname: "Admin",
//                 role: "admin"
//             });
//         } else {
//             // Otherwise, fetch user profile from the server
//             axios.get(`http://localhost:5000/userEmail`, {params: {email: userEmail}})
//                 .then(response => {
//                     console.log(response.data);
//                     setUser(response.data);
//                 })
//                 .catch(error => {
//                     console.error('Error fetching user profile:', error);
//                 });
//         }
//     }, []);

//     if (!user) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <div className="container profile-page">
//             <h1>User Profile</h1>
//             <div className="profile-info">
//                 <div className="profile-item">First Name: {user.firstname}</div>
//                 <div className="profile-item">Last Name: {user.lastname}</div>
//                 <div className="profile-item">Email: {user.email}</div>
//                 <div className="profile-item">Role: {user.role}</div>
//                 <div className='profile-item'>
//                     <Button variant="outlined">Change Password</Button>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Profile;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css'; // Import your custom CSS file
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';

function Profile() {
    const [user, setUser] = useState(null);
    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

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
            axios.get(`http://localhost:5000/userEmail`, { params: { email: userEmail } })
                .then(response => {
                    console.log(response.data);
                    setUser(response.data);
                })
                .catch(error => {
                    console.error('Error fetching user profile:', error);
                });
        }
    }, []);

    const handleOpenPasswordDialog = () => {
        setOpenPasswordDialog(true);
    };

    const handleClosePasswordDialog = () => {
        setOpenPasswordDialog(false);
        // Clear password fields when dialog is closed
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setError(null);
    };

    const handleChangePassword = () => {
        // Validation
        if (newPassword !== confirmPassword) {
            setError('New password and confirm password do not match');
            return;
        }
        setError(null);

        // Send request to backend to update password
        axios.put(`http://localhost:5000/changePassword`, {
            email: user.email,
            oldPassword: oldPassword,
            newPassword: newPassword,
            role: user.role
        })
            .then(response => {
                setSuccessMessage('Password updated successfully');
                handleClosePasswordDialog();
            })
            .catch(error => {
                setError('Error updating password');
            });
    };

    return (
        <div className="container profile-page">
            <h1>User Profile</h1>
            <div className="profile-info">
                <div className="profile-item">First Name: {user?.firstname}</div>
                <div className="profile-item">Last Name: {user?.lastname}</div>
                <div className="profile-item">Email: {user?.email}</div>
                <div className="profile-item">Role: {user?.role}</div>
                <div className='profile-item'>
                    <Button variant="outlined" onClick={handleOpenPasswordDialog}>Change Password</Button>
                </div>
            </div>
            {/* Password Change Dialog */}
            <Dialog open={openPasswordDialog} onClose={handleClosePasswordDialog}>
                <DialogTitle>Change Password</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Old Password"
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />
                    <TextField
                        label="New Password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <TextField
                        label="Confirm New Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {error && <p className="error-message">{error}</p>}
                    {successMessage && <p className="success-message">{successMessage}</p>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePasswordDialog}>Cancel</Button>
                    <Button onClick={handleChangePassword}>Change Password</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Profile;

