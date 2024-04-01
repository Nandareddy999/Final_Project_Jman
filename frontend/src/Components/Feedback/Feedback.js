import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Feedback.css';

function Feedback() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [questions, setQuestions] = useState([]);
  const [newQuestionInputs, setNewQuestionInputs] = useState([0]);

  // Fetching users from MongoDB on component mount
  useEffect(() => {
    axios
      .get('http://localhost:5000/user') // Adjust the API endpoint based on your backend setup
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

  // Function to handle user selection
  const handleUserSelect = e => {
    setSelectedUser(e.target.value);
  };

  // Function to add a new question input
  const addQuestionInput = () => {
    setNewQuestionInputs([...newQuestionInputs, newQuestionInputs.length]);
  };

  // Function to remove a question input
  const removeQuestionInput = index => {
    if (newQuestionInputs.length === 1) {
      return;
    }
    const updatedInputs = [...newQuestionInputs];
    updatedInputs.splice(index, 1);
    setNewQuestionInputs(updatedInputs);
    setQuestions(questions.filter((_, i) => i !== index));
  };

  // Function to handle question input change
  const handleQuestionChange = (index, e) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = e.target.value;
    setQuestions(updatedQuestions);
  };

  // Function to submit the feedback form
  const handleSubmit = () => {
    // You can implement the submission logic here, such as sending the data to the server
    console.log('Feedback form submitted:', { user: selectedUser, questions });
    // Reset form state after submission if needed
    setSelectedUser('');
    setQuestions([]);
    setNewQuestionInputs([0]);
  };

  return (
    <div className="feedback-container">
      <h2 className="feedback-heading">Feedback Form</h2>
      <div className="feedback-group">
        <label htmlFor="userSelect" className="feedback-label">
          Select User:
        </label>
        <select
          id="userSelect"
          className="feedback-select"
          value={selectedUser}
          onChange={handleUserSelect}
        >
          <option value="">Select User</option>
          {users.map(user => (
            <option key={user._id} value={user._id}>
              {user.firstname + ' ' + user.lastname}
            </option>
          ))}
        </select>
      </div>
      <div className="feedback-group">
        <label className="feedback-label">Feedback Questions:</label>
        {newQuestionInputs.map((inputIndex, index) => (
          <div key={index} className="feedback-input-group">
            <input
              type="text"
              className="feedback-input"
              value={questions[index] || ''}
              onChange={e => handleQuestionChange(index, e)}
              placeholder="Enter question"
              required={index === 0}
            />
            {index === 0 ? null : (
              <button
                className="feedback-btn-delete"
                onClick={() => removeQuestionInput(index)}
                disabled={index === 0}
              >
                Delete
              </button>
            )}
          </div>
        ))}
        <button className="feedback-btn feedback-btn-add" onClick={addQuestionInput}>
          Add Question
        </button>
      </div>
      <div className="feedback-group">
        <button className="feedback-btn-submit" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default Feedback;