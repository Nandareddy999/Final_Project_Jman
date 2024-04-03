import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Feedback.css';

function Feedback() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedUserEmail, setSelectedUserEmail] = useState('');
  const [selectedUserName, setSelectedUserName] = useState('');
  const [questions, setQuestions] = useState([]);
  const [newQuestionInputs, setNewQuestionInputs] = useState([0]);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser !== '') {
      const selectedUserData = users.find(user => user._id === selectedUser);
      if (selectedUserData) {
        setSelectedUserEmail(selectedUserData.email);
        setSelectedUserName(selectedUserData.firstname + ' ' + selectedUserData.lastname);
      } else {
        setSelectedUserEmail('');
        setSelectedUserName('');
      }
    }
  }, [selectedUser, users]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/user');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
      if (data.length > 0) {
        setSelectedUser(data[0]._id);
        setSelectedUserEmail(data[0].email);
        setSelectedUserName(data[0].firstname + ' ' + data[0].lastname);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleUserChange = e => {
    const selectedUserId = e.target.value;
    setSelectedUser(selectedUserId);
    const selectedUserData = users.find(user => user._id === selectedUserId);
    if (selectedUserData) {
      setSelectedUserEmail(selectedUserData.email);
      setSelectedUserName(selectedUserData.firstname + ' ' + selectedUserData.lastname);
    } else {
      setSelectedUserEmail('');
      setSelectedUserName('');
    }
  };

  const addQuestionInput = () => {
    setNewQuestionInputs([...newQuestionInputs, newQuestionInputs.length]);
  };

  const removeQuestionInput = index => {
    if (newQuestionInputs.length === 1) {
      return;
    }
    const updatedInputs = [...newQuestionInputs];
    updatedInputs.splice(index, 1);
    setNewQuestionInputs(updatedInputs);
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index, e) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = e.target.value;
    setQuestions(updatedQuestions);
  };

  const handleSubmit = () => {
    // Check if a user is selected
    if (!selectedUser) {
      alert('Please select a user');
      return;
    }
  
    // Check if at least one question is entered
    if (questions.length === 0 || questions.every(question => question.trim() === '')) {
      alert('Please enter at least one question');
      return;
    }
  
    // If validation passes, submit the feedback
    axios.post('http://localhost:5000/submit-admin-feedback', {
      email: selectedUserEmail,
      username: selectedUserName,
      questions: questions // Sending questions array to the backend
      
    })
    .then(response => {
      console.log('Feedback submitted successfully:', response.data); // Check the response data in the console
      setSuccessMessage('Feedback submitted successfully');
      setSelectedUser('');
      setSelectedUserEmail('');
      setSelectedUserName('');
      setQuestions([]);
      setNewQuestionInputs([0]);
    })
    .catch(error => {
      console.error('Error submitting feedback:', error);
      // Handle error if necessary
    });
  };
  

  return (
    <div className="adminfeedback-container">
      <h2 className="adminfeedback-heading">Feedback Form</h2>
      {successMessage && 
        <div className="alert alert-success alert-dismissible fade show custom-alert" role="alert">
          {successMessage}
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setSuccessMessage(null)}></button>
        </div>
      }
      <div className="adminfeedback-group">
        <label htmlFor="userSelect" className="adminfeedback-label">
          Select User:
        </label>
        <select
          id="userSelect"
          className="adminfeedback-select"
          value={selectedUser}
          onChange={handleUserChange}
        >
          <option value="">Select User</option>
          {users.map(user => (
            <option key={user._id} value={user._id}>
              {user.firstname + ' ' + user.lastname}
            </option>
          ))}
        </select>
      </div>
      {selectedUserEmail && (
        <div className="adminfeedback-group">
          <label className="adminfeedback-label">Selected User's Email:</label>
          <input
            type="text"
            className="adminfeedback-input"
            value={selectedUserEmail}
            readOnly={true}
          />
        </div>
      )}
      <div className="adminfeedback-group">
        <label className="adminfeedback-label">Feedback Questions:</label>
        {newQuestionInputs.map((inputIndex, index) => (
          <div key={index} className="adminfeedback-input-group">
            <input
              type="text"
              className="adminfeedback-input"
              value={questions[index] || ''}
              onChange={e => handleQuestionChange(index, e)}
              placeholder="Enter question"
              required={index === 0}
            />
            {index === 0 ? null : (
              <button
                className="adminfeedback-btn-delete"
                onClick={() => removeQuestionInput(index)}
                disabled={index === 0}
              >
                Delete
              </button>
            )}
          </div>
        ))}
        <button className="adminfeedback-btn adminfeedback-btn-add" onClick={addQuestionInput}>
          Add Question
        </button>
      </div>
      <div className="adminfeedback-group">
        <button className="adminfeedback-btn-submit" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default Feedback;


