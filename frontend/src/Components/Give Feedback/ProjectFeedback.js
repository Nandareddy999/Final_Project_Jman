import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import '@fontsource/roboto/300.css';

const labels = {
  0.5: 'Terrible',
  1: 'Poor',
  1.5: 'Below Average',
  2: 'Average',
  2.5: 'Fair',
  3: 'Good',
  3.5: 'Very Good',
  4: 'Excellent',
  4.5: 'Outstanding',
  5: 'Exceptional',
};

function getLabelText(value) {
  return labels[value];
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
  
      // Map numerical ratings to text labels
      const ratingsInText = ratings.map(rating => getLabelText(rating));
  
      const response = await axios.post('http://localhost:5000/submit-project-feedback', {
        user: user,
        ratings: ratingsInText, // Use ratings in text form
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
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Typography from '@mui/material/Typography';
// import TextareaAutosize from '@mui/material/TextareaAutosize';
// import Button from '@mui/material/Button';
// import Box from '@mui/material/Box';
// import Rating from '@mui/material/Rating';
// import '@fontsource/roboto/300.css';

// const labels = {
//   0.5: 'Terrible',
//   1: 'Poor',
//   1.5: 'Below Average',
//   2: 'Average',
//   2.5: 'Fair',
//   3: 'Good',
//   3.5: 'Very Good',
//   4: 'Excellent',
//   4.5: 'Outstanding',
//   5: 'Exceptional',
// };

// function getLabelText(value) {
//   return labels[value];
// }

// function ProjectFeedback() {
//   const [questions, setQuestions] = useState([]);
//   const [feedback, setFeedback] = useState('');
//   const [ratings, setRatings] = useState([]);
//   const [successMessage, setSuccessMessage] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10)); // Default to today's date

//   useEffect(() => {
//     fetchQuestions(selectedDate); // Fetch questions for selected date when component mounts
//   }, [selectedDate]); // Re-fetch questions when selectedDate changes

//   const user = JSON.parse(localStorage.getItem('user'));

//   const fetchQuestions = async (date) => {
//     try {
//       const userEmail = JSON.parse(localStorage.getItem('user')).email;
//       const response = await axios.get(`http://localhost:5000/userId?email=${userEmail}`);
//       const userId = response.data.userId;
//       const questionsResponse = await axios.get(`http://localhost:5000/questions?userId=${userId}&date=${date}`);
//       setQuestions(questionsResponse.data);
//       const initialRatings = questionsResponse.data.map(() => 0);
//       setRatings(initialRatings);
//     } catch (error) {
//       console.error('Error fetching questions:', error);
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       if (!feedback.trim()) {
//         alert('Please enter feedback');
//         return;
//       }
  
//       if (ratings.some(rating => rating === 0)) {
//         alert('Please rate all questions');
//         return;
//       }
  
//       // Map numerical ratings to text labels
//       const ratingsInText = ratings.map(rating => getLabelText(rating));
  
//       const response = await axios.post('http://localhost:5000/submit-project-feedback', {
//         user: user,
//         ratings: ratingsInText, // Use ratings in text form
//         feedback: feedback,
//       });
//       console.log('Project feedback submitted successfully:', response.data);
//       setSuccessMessage('Project feedback submitted successfully');
//       setFeedback('');
//       setRatings(ratings.map(() => 0));
//     } catch (error) {
//       console.error('Error submitting project feedback:', error);
//     }
//   };

//   return (
//     <div className="project-feedback-container">
//       {successMessage ? (
//         <div className="alert alert-success" role="alert">
//           {successMessage}
//         </div>
//       ) : (
//         <>
//           <Typography variant="h3" gutterBottom>Project Feedback</Typography>
//           <div className="feedback-date">
//             <label htmlFor="date">Select Date:</label>
//             <input
//               type="date"
//               id="date"
//               value={selectedDate}
//               onChange={(e) => setSelectedDate(e.target.value)}
//             />
//           </div>
//           <div className="feedback-questions">
//             {questions && questions.map((question, index) => (
//               <div key={index} className="feedback-question">
//                 <Typography variant="body1" gutterBottom>{question.text}</Typography>
//                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                   <Rating
//                     name={`rating-${index}`}
//                     value={ratings[index]}
//                     precision={0.5}
//                     onChange={(event, newValue) => {
//                       const updatedRatings = [...ratings];
//                       updatedRatings[index] = newValue;
//                       setRatings(updatedRatings);
//                     }}
//                   />
//                   <Typography sx={{ ml: 2 }}>{labels[ratings[index]]}</Typography>
//                 </Box>
//               </div>
//             ))}
//           </div>
//           <div className="feedback-input">
//             <label htmlFor="feedback">Your Feedback:</label>
//             <TextareaAutosize
//               id="feedback"
//               rows="4"
//               cols="50"
//               value={feedback}
//               onChange={(e) => setFeedback(e.target.value)}
//             />
//           </div>
//           <div className="feedback-submit">
//             <Button variant="contained" color="primary" onClick={handleSubmit}>Submit Feedback</Button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// export default ProjectFeedback
