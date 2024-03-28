import React, { useState, useEffect } from 'react';
import axios from 'axios'; // You may need to install axios using `npm install axios`
import './Feedback.css';

function Feedback() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [questions, setQuestions] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [comments, setComments] = useState('');

  // Fetching users from MongoDB on component mount
  useEffect(() => {
    axios.get('http://localhost:5000/user') // Adjust the API endpoint based on your backend setup
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

  // Function to handle user selection
  const handleUserSelect = (e) => {
    setSelectedUser(e.target.value);
  };

  // Function to add a new question to the feedback form
  const addQuestion = () => {
    setQuestions([...questions, '']); // Adding an empty string as a placeholder for a new question
  };

  // Function to handle question input change
  const handleQuestionChange = (index, e) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = e.target.value;
    setQuestions(updatedQuestions);
  };

  // Function to handle rating input change
  const handleRatingChange = (index, e) => {
    const updatedFeedback = [...feedback];
    updatedFeedback[index] = parseInt(e.target.value);
    setFeedback(updatedFeedback);
  };

  // Function to handle comment input change
  const handleCommentChange = (e) => {
    setComments(e.target.value);
  };

  // Function to submit the feedback form
  const handleSubmit = () => {
    const formData = {
      user: selectedUser,
      questions: questions,
      feedback: feedback,
      comments: comments
    };
    console.log('Submitted feedback:', formData);
    // You can send the formData to your backend for further processing (e.g., saving to MongoDB)
  };

  return (
    <div className="feedback-form">
      <h2>Feedback Form</h2>
      <div className="form-group">
        <label>Select User:</label>
        <select className="form-control" value={selectedUser} onChange={handleUserSelect}>
          <option value="" active>Select User</option>
          {users.map(user => (
            <option key={user._id} value={user._id}>{user.firstname + " " +  user.lastname}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Feedback Questions:</label>
        {questions.map((question, index) => (
          <input key={index} type="text" className="form-control" value={question} onChange={(e) => handleQuestionChange(index, e)} placeholder={`Question ${index + 1}`} />
        ))}
        <button className="btn btn-primary" onClick={addQuestion}>Add Question</button>
      </div>
      <div className="form-group">
        <label>Feedback Ratings:</label>
        {questions.map((question, index) => (
          <input key={index} type="number" className="form-control" value={feedback[index]} onChange={(e) => handleRatingChange(index, e)} placeholder={`Rating for Question ${index + 1}`} min="0" max="5" />
        ))}
      </div>
      <div className="form-group">
        <label>Comments:</label>
        <textarea className="form-control" value={comments} onChange={handleCommentChange} placeholder="Add comments..."></textarea>
      </div>
      <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default Feedback;
