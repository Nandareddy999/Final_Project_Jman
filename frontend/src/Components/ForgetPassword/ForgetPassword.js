import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function ForgetPassword() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const sendOtp = async () => {
        try {
            // Make an API call to your backend to send the OTP to the provided email address
            const response = await fetch('http://localhost:5000/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }), // Assuming 'email' is the state variable holding the user's email
            });
            if (response.ok) {
                setOtpSent(true);
            } else {
                console.error('Failed to send OTP:', response.statusText);
            }
        } catch (error) {
            console.error('Failed to send OTP:', error.message);
        }
    };

    const handleSubmit = async () => {
        try {
            // Make an API call to your backend to verify OTP and change password
            const response = await fetch('hhtp://localhost:5000/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp, password }),
            });
            if (response.ok) {
                console.log('Password changed successfully');
                // Optionally, you can redirect the user to a different page or display a success message
            } else {
                console.error('Failed to change password:', response.statusText);
            }
        } catch (error) {
            console.error('Failed to change password:', error.message);
        }
    };

    return (
        <div>
            {!otpSent ? (
                <div>
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button variant="contained" color="primary" onClick={sendOtp}>
                        Generate OTP
                    </Button>
                </div>
            ) : (
                <div>
                    <TextField
                        label="OTP"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <TextField
                        label="New Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                        label="Confirm Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Save Password
                    </Button>
                </div>
            )}
        </div>
    );
}

export default ForgetPassword;
