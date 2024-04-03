import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GiveFeedback.css'; // Import custom CSS file

function GiveFeedback() {
  const [feedbackQuestions, setFeedbackQuestions] = useState([]);
  const [feedbackAnswers, setFeedbackAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchFeedbackQuestions = async () => {
      try {
        // Fetch user from localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        const userEmail = user.email;

        // Fetch feedback questions based on user's email
        const response = await axios.get(`http://localhost:5000/user-feedback/${userEmail}`);
        const questions = response.data.questions;
        setFeedbackQuestions(questions);
        setFeedbackAnswers(new Array(questions.length).fill(''));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching feedback questions:', error);
      }
    };

    fetchFeedbackQuestions();
  }, []);

  const handleAnswerChange = (index, event) => {
    const newAnswers = [...feedbackAnswers];
    newAnswers[index] = event.target.value;
    setFeedbackAnswers(newAnswers);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      // Fetch user from localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      const userEmail = user.email;
  
      // Fetch the user ID from the backend based on the email
      const userResponse = await axios.get(`http://localhost:5000/userEmail?email=${userEmail}`);
      const userId = userResponse.data._id;
  
      // Map feedback answers to the corresponding question IDs
      const feedback = feedbackQuestions.map((question, index) => ({
        userId: userId,
        questionId: question._id,
        response: feedbackAnswers[index] || '', // If no answer provided, set it to an empty string
      }));
  
      // Submit the feedback to the backend
      await axios.post('http://localhost:5000/user-response', { userEmail: userEmail, feedback });
  
      // Remove answered questions from the frontend
      const updatedQuestions = feedbackQuestions.filter((question, index) => !feedbackAnswers[index]);
      setFeedbackQuestions(updatedQuestions);
      
      // Display success message
      setSuccessMessage('Feedback submitted successfully');

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback');
    }
  };

  return (
    <div className="feedback-container">
      {loading ? (
        <p>Loading...</p>
      ) : feedbackQuestions.length === 0 ? (
        <p>No feedback questions available</p>
      ) : (
        <div className="feedback-form">
          <h2>Feedback Questions</h2>
          <form onSubmit={handleSubmit}>
            <ul>
              {feedbackQuestions.map((question, index) => (
                <li key={question._id}>
                  <p>{question.text}</p>
                  <input
                    type="text"
                    value={feedbackAnswers[index] || ''}
                    onChange={(event) => handleAnswerChange(index, event)}
                  />
                </li>
              ))}
            </ul>
            <button type="submit">Submit Feedback</button>
          </form>
        </div>
      )}
      {successMessage && 
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      }
    </div>
  );
}

export default GiveFeedback;
