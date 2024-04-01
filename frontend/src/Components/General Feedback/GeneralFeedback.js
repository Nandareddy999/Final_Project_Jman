import React, { useState, useEffect } from 'react';
import './GeneralFeedback.css'; // Import CSS file for custom styling

function GeneralFeedback() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedUserEmail, setSelectedUserEmail] = useState('');
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        // Fetch users from the backend when the component mounts
        fetchUsers();
    }, []); // Empty dependency array ensures this effect runs only once after initial render

    useEffect(() => {
        if (selectedUser !== '') {
            const selectedUserData = users.find(user => user.id === selectedUser);
            if (selectedUserData) {
                setSelectedUserEmail(selectedUserData.email);
            } else {
                setSelectedUserEmail('');
            }
        }
    }, [ users]);
    
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
        } else {
            setSelectedUserEmail('');
        }
    };

    const handleFeedbackChange = (e) => {
        setFeedback(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Selected User:", selectedUser);
        console.log("Feedback:", feedback);
        setSelectedUser('');
        setFeedback('');
    };

    return (
        <div className="container d-flex justify-content-center align-items-center custom-container">
            <div className="custom-card">
                <h2 className="text-center mb-4">General Feedback</h2>
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
                    <button type="submit" className="btn btn-primary">Submit Feedback</button>
                </form>
            </div>
        </div>
    );
}

export default GeneralFeedback;
