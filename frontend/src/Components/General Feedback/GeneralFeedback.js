import React, { useState, useEffect } from 'react';
import './GeneralFeedback.css'; // Import CSS file for custom styling

function GeneralFeedback() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedUserName, setSelectedUserName] = useState(null);
    const [selectedUserEmail, setSelectedUserEmail] = useState('');
    const [feedback, setFeedback] = useState('');
    const [successMessage, setSuccessMessage] = useState(null); // New state for success message

    useEffect(() => {
        // Fetch users from the backend when the component mounts
        fetchUsers();
    }, []); // Empty dependency array ensures this effect runs only once after initial render

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:5000/user');
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const data = await response.json();
            setUsers(data);
            // Set the initial selected user and email after fetching users
            if (data.length > 0) {
                setSelectedUser(data[0].id);
                setSelectedUserEmail(data[0].email);
            }
            console.log(data);
        } catch (error) {
            console.error('Error fetching users:', error);
            // Handle error, show error message or retry logic
        }
    };

    const handleUserChange = (e) => {
        const selectedUserId = e.target.value;
        setSelectedUser(selectedUserId);
        const selectedUserData = users.find(user => user._id === selectedUserId);
        if (selectedUserData) {
            setSelectedUserEmail(selectedUserData.email);
            setSelectedUserName(selectedUserData.firstname +' ' + selectedUserData.lastname);
        } else {
            setSelectedUserEmail('');
        }
    };

    const handleFeedbackChange = (e) => {
        setFeedback(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/submit-user-feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userName: selectedUserName,
                    email: selectedUserEmail,
                    feedback: feedback
                })
            });
            if (!response.ok) {
                throw new Error('Failed to submit feedback');
            }
            const responseData = await response.json(); // Assuming the backend sends a JSON response
            setSuccessMessage('Feedback submitted successfully'); // Set success message
            setSelectedUser('');
            setFeedback('');
            // Handle the response from the backend as needed
            console.log('Response from backend:', responseData);
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('Failed to submit feedback');
        }
    };

    return (
        <div className="container custom-container">
            <div className="custom-card">
                <h2 className="text-center mb-4">General Feedback</h2>
                <div className="text-center">
                    {/* Render success message if successMessage is not null */}
                    {successMessage && 
                        <div className="alert alert-success alert-dismissible fade show custom-alert" role="alert">
                            {successMessage}
                            <button
                                type="button"
                                className="btn-close ms-auto" // Add ms-auto class for right alignment
                                data-bs-dismiss="alert"
                                aria-label="Close"
                                onClick={() => setSuccessMessage(null)}
                            ></button>
                        </div>
                    }
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Select User:</label>
                        <select className="form-control" value={selectedUser} onChange={handleUserChange}>
                            <option value="">Select User</option>
                            {users.map(user => (
                                <option key={user._id} value={user._id}>{user.firstname + " " + user.lastname}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>User Email:</label>
                        <input type="email" className="form-control" value={selectedUserEmail} readOnly />
                    </div>
                    <div className="form-group">
                        <label>Feedback:</label>
                        <textarea
                            className="form-control"
                            value={feedback}
                            onChange={handleFeedbackChange}
                            rows={4}
                            placeholder="Enter your feedback..."
                        ></textarea>
                    </div>
                    <div className="text-end"> {/* Align button to the right */}
                        <button type="submit" className="btn btn-primary">Submit Feedback</button>
                    </div>
                </form>
            </div>
        </div>
    );
    
}

export default GeneralFeedback;
