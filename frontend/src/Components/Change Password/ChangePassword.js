import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ChangePassword() {
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState('');
    const [newemail, setNewEmail] = useState('');

    const handleChange = async () => {
        try {
            await axios.post('http://localhost:5000/update-password', { token, newPassword, newemail });
            console.log('Password and Email updated successfully');
        } catch (error) {
            console.error('Error updating password and Email:', error);
        }
    };


    return (
        <div>
            <h2>Change Email</h2>
            <input type="password" value={newemail} onChange={(e) => setNewEmail(e.target.value)} />
            <button onClick={handleChange}>Change Email</button>
            <h2>Change Password</h2>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <button onClick={handleChange}>Change Password</button>
        </div>
    );
}

export default ChangePassword;