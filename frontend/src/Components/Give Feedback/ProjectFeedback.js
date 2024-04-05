import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import '@fontsource/roboto/300.css';

const labels = {
  0.5: 'Useless',
  1: 'Useless+',
  1.5: 'Poor',
  2: 'Poor+',
  2.5: 'Ok',
  3: 'Ok+',
  3.5: 'Good',
  4: 'Good+',
  4.5: 'Excellent',
  5: 'Excellent+',
};

function getLabelText(value) {
  return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
}

function ProjectFeedback() {
  const [questions, setQuestions] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [ratings, setRatings] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const user = JSON.parse(localStorage.getItem('user'));

  const fetchQuestions = async () => {
    try {
      const userEmail = JSON.parse(localStorage.getItem('user')).email;
      const response = await axios.get(`http://localhost:5000/userId?email=${userEmail}`);
      const userId = response.data.userId;
      const questionsResponse = await axios.get(`http://localhost:5000/questions?userId=${userId}`);
      setQuestions(questionsResponse.data);
      const initialRatings = questionsResponse.data.map(() => 0);
      setRatings(initialRatings);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!feedback.trim()) {
        alert('Please enter feedback');
        return;
      }

      if (ratings.some(rating => rating === 0)) {
        alert('Please rate all questions');
        return;
      }

      const response = await axios.post('http://localhost:5000/submit-project-feedback', {
        user: user,
        ratings: ratings,
        feedback: feedback,
      });
      console.log('Project feedback submitted successfully:', response.data);
      setSuccessMessage('Project feedback submitted successfully');
      setFeedback('');
      setRatings(ratings.map(() => 0));
    } catch (error) {
      console.error('Error submitting project feedback:', error);
    }
  };

  return (
    <div className="project-feedback-container">
      {successMessage ?(
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
        ) : (
          <>
          <Typography variant="h3" gutterBottom>Project Feedback</Typography>
          <div className="feedback-questions">
            {questions && questions.map((question, index) => (
              <div key={index} className="feedback-question">
                <Typography variant="body1" gutterBottom>{question.text}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Rating
                    name={`rating-${index}`}
                    value={ratings[index]}
                    precision={0.5}
                    onChange={(event, newValue) => {
                      const updatedRatings = [...ratings];
                      updatedRatings[index] = newValue;
                      setRatings(updatedRatings);
                    }}
                  />
                  <Typography sx={{ ml: 2 }}>{labels[ratings[index]]}</Typography>
                </Box>
              </div>
            ))}
          </div>
          <div className="feedback-input">
            <label htmlFor="feedback">Your Feedback:</label>
            <TextareaAutosize
              id="feedback"
              rows="4"
              cols="50"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>
          <div className="feedback-submit">
            <Button variant="contained" color="primary" onClick={handleSubmit}>Submit Feedback</Button>
          </div>
        </>
      )}
    
    </div>
  );
}

export default ProjectFeedback;
  