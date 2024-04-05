import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

function ForgetPassword() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const sendOtp = async () => {
        try {
            // Make an API call to your backend to send the OTP to the provided email address
            const response = await fetch('http://localhost:5000/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
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
            const response = await fetch('http://localhost:5000/verify-otp ', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ otp, email, password }),
            });
            if (response.ok) {
                console.log('Password changed successfully');
            } else {
                const data = await response.json();
                if (data.error === 'wrong_otp') {
                    setErrorMessage('Wrong OTP entered.');
                } else if (data.error === 'password_mismatch') {
                    setErrorMessage('Passwords do not match.');
                } else {
                    setErrorMessage('Failed to change password.');
                }
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
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={!otp || !password || !confirmPassword}
                    >
                        Save Password
                    </Button>
                </div>
            )}
            <Link to="/">Go to Login</Link>
        </div>
    );
}

export default ForgetPassword;