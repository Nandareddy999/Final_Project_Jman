const express = require("express");
const bcrypt = require("bcrypt");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const { mongoose } = require('mongoose');
const { v4: uuidv4 } = require("uuid"); // Import UUID generator
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const { Schema } = mongoose;


const app = express();
app.use(require("cors")());
app.use(bodyParser.json());

const port = process.env.PORT || 5000;

// MongoDB Connection URI
const uri =
  "mongodb+srv://NandaKumar:Nandareddy%40123@cluster0.s9jwc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a new MongoClient
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
let db,
  adminCollection,
  userCollection,
  adminFeedbackCollection,
  userFeedbackCollection,
  userResponseCollection,
  timeSheetCollection,
  otpDataCollection,
  questionCollection,
  ratingCollection;

client
  .connect()
  .then(() => {
    console.log("Connected to MongoDB");
    db = client.db("CustomerData");
    adminCollection = db.collection("AdminData");
    userCollection = db.collection("UserData");
    adminFeedbackCollection = db.collection("AdminFeedback");
    userFeedbackCollection = db.collection("UserFeedback");
    userResponseCollection = db.collection("UserResponse");
    timeSheetCollection = db.collection("TimeSheetData");
    otpDataCollection = db.collection("OtpData");
    questionCollection = db.collection( "Questions" );
    ratingCollection = db.collection("Rating") ;
  })
  .catch((err) => {
    console.log(err);
  });

// MongoDB Schema Definitions
const adminSchema = {
  username: String,
  password: String,
  email: String,
};

const userSchema = {
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  role: String,
};

const adminFeedbackSchema = {
  username: String,
  email: String,
  questions: {
    _id: String,
    text: String,
  },
};

const userFeedbackSchema = {
  userName: String,
  email: String,
  feedback: [String],
};

const userResponseSchema = {
  userId: String,
  responses: {
    question_id: String,
    reponse: String,
  },
};

const timeSheetSchema = {
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  userEmail : String,
  UserName : String,
  activities: [
    {
      name: {
        type: String,
        required: true,
      },
      hours: {
        type: [Number],
        validate: {
          validator: function (hours) {
            return hours.length === 7;
          },
          message: (props) =>
            `${props.value} does not contain exactly 7 entries`,
        },
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  totalHoursPerDay: {
    type: [Number],
    validate: {
      validator: function (hours) {
        return hours.length === 7;
      },
      message: (props) => `${props.value} does not contain exactly 7 entries`,
    },
  },
  totalHours: {
    type: Number,
    required: true,
  },
};

const OTPSchema = {
  email: {
      type: String,
      required: true,
      unique: true
  },
  otp: {
      type: String,
      required: true
  },
  createdAt: {
      type: Date,
      default: Date.now,
      expires: 300 // OTP documents expire after 5 minutes (300 seconds)
  }
};

const questionSchema = {
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'UserData', // Assuming there's a User model referenced by userId
    required: true
  },
  questions: [{
    text: {
      type: String,
      required: true
    }
  }] // Array of question objects
};


const feedbackSchema = {
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questionCollection: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QuestionCollection',
    required: true
  },
  ratings: [Number],
  feedback: String
};

// Express Routes
// Insert admin data into the collection
app.post("/admin", async (req, res) => {
  try {
    const result = await adminCollection.insertOne(req.body);
    res.send(result);
  } catch (error) {
    console.error("Error inserting admin data:", error);
    res.status(500).send("Error inserting admin data");
  }
});

// Get all admin data
app.get("/admin", async (req, res) => {
  try {
    const data = await adminCollection.find({}).toArray();
    res.send(data);
  } catch (error) {
    console.error("Error getting admin data:", error);
    res.status(500).send("Error getting admin data");
  }
});

// Insert user data into the collection
app.post("/user", async (req, res) => {
  try {
    const { firstname, lastname, email, password, role } = req.body;

    // Check if the user already exists in the database
    const existingUser = await userCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    const salt = await bcrypt.genSalt();
    const hashedpassword = await bcrypt.hash(password, salt);
    const result = await userCollection.insertOne({
      firstname,
      lastname,
      email,
      password: hashedpassword,
      role,
    });

    res.send(result);
  } catch (error) {
    console.error("Error inserting user data:", error);
    res.status(500).send("Error inserting user data");
  }
});

// Get all user data
app.get("/user", async (req, res) => {
  try {
    const data = await userCollection.find({}).toArray();
    res.send(data);
  } catch (error) {
    console.error("Error getting user data:", error);
    res.status(500).send("Error getting user data");
  }
});

app.get("/userEmail", async (req, res) => {
  const userEmail = req.query.email; // Access email parameter from query string
  try {
    const user = await userCollection.findOne({ email: userEmail });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


//email 

const transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
      user: 'mutukundu@jmangroup.com',
      pass: 'Jman@600113'
  }
});

app.post('/send-email', async (req, res) => {
  try {
      const { email, password, link } = req.body;

      // Create a transporter object using SMTP transport
      

      // Email content
      const mailOptions = {
          from: 'mutukundu@jmangroup.com',
          to: email,
          subject: 'Account Created',
          text: `Your account has been created successfully. Your temporary password is: ${password}\n\n Please use this password to log in and ${link} use this link to reset your password.`,
          html: `<p>Your account has been created successfully.Your temporary password is: <strong>${password}</strong>. Please use this password to log in and ${link} use this link to  reset your password.</p>`
      };

      // Send email
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              console.error('Error sending email:', error);
              res.status(500).json({ error: 'Error sending email' });
          } else {
              console.log('Email sent:', info.response);
              res.status(200).json({ message: 'Email sent successfully' });
          }
      });
  } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Error sending email' });
  }
});


app.post("/send-otp", async (req, res) => {
  try {
      const { email } = req.body;

      // Check if the user already exists in otpDataCollection
      const existingUser = await otpDataCollection.findOne({ email });

      // Generate new OTP
      const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
      console.log('Generated OTP:', otp);

      // Update or insert the OTP record
      if (existingUser) {
          await otpDataCollection.updateOne({ email }, { $set: { otp } });
      } else {
          await otpDataCollection.insertOne({ email, otp });
      }

      // Send OTP via email
      const mailOptions = {
          from: 'mutukundu@jmangroup.com',
          to: email,
          subject: 'Password Reset OTP',
          text: `Your OTP is: ${otp}. Please use this OTP to reset your password.`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              console.error('Error sending email:', error);
              res.status(500).json({ error: 'Error sending email' });
          } else {
              console.log('Email sent:', info.response);
              res.status(200).json({ message: 'OTP sent successfully' });
          }
      });
  } catch (error) {
      console.error("Error Sending Otp:", error);
      res.status(500).json({ error: "Error Sending Otp" });
  }
});



app.post("/verify-otp", async (req, res) => {
  try {
      const { otp, email, password } = req.body;

      // Find the user based on the provided email in otpData collection
      const userInOtpData = await otpDataCollection.findOne({email: email});

      if (!userInOtpData) {
          return res.status(404).json({ error: 'User not found' });
      }
      // Check if the OTP matches
      if (userInOtpData.otp !== otp) {
          return res.status(400).json({ error: 'Invalid OTP' });
      }

      // Find the user based on the email in userData collection
      const userInUserData = await userCollection.findOne({ email });

      if (!userInUserData) {
          return res.status(404).json({ error: 'User not found' });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      console.log("Hashed Password:", hashedPassword);

      // Update the user's password
      userInUserData.password = hashedPassword;

      console.log("User Object Before Update:", userInUserData);

      // Ensure that the update operation is awaited
      await userCollection.updateOne({ email: email }, { $set: { password: hashedPassword } });

      console.log("User Object After Update:", userInUserData);

      // Clear the OTP field after successful verification
      userInOtpData.otp = null;

      res.json({ message: 'Password changed successfully' });
  } catch (error) {
      console.error("Error Verifying OTP:", error);
      res.status(500).json({ error: "Error Verifying OTP" });
  }
});



app.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists in the admin collection
    const admin = await adminCollection.findOne({ email });

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    // Compare passwords using bcrypt
    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Successful login
    res.status(200).json({ message: "Admin login successful" });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Error logging in" });
  }
});

// User login route
app.post("/user/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists in the user collection
    const user = await userCollection.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Successful login
    res.status(200).json({ message: "User login successful" });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Error logging in" });
  }
});

app.put("/changePassword", async (req, res) => {
  try {
    // Retrieve user's email, old password, new password, and role from request body
    const { email, oldPassword, newPassword, role } = req.body;

    // Check if the user exists in the AdminData table
    let user;
    if (role === "admin") {
      user = await adminCollection.findOne({ email });
    } else {
      user = await userCollection.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the old password matches
    let isPasswordValid = false;
    if (user.password.startsWith("$")) {
      // Check if the password is hashed
      isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    } else {
      // If the password is plaintext
      isPasswordValid = oldPassword === user.password;
    }

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the appropriate collection based on the role
    if (role === "admin") {
      await adminCollection.updateOne(
        { email },
        { $set: { password: hashedPassword } }
      );
    } else {
      await userCollection.updateOne(
        { email },
        { $set: { password: hashedPassword } }
      );
    }

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/submit-admin-feedback", async (req, res) => {
  try {
    const { email, username, questions } = req.body;

    // Check if the user exists based on email in the adminFeedbackCollection
    const existingUserFeedback = await adminFeedbackCollection.findOne({
      email,
    });

    // If the user exists, update their record with new feedback questions
    if (existingUserFeedback) {
      // Ensure questions is an array
      const updatedQuestions = Array.isArray(existingUserFeedback.questions)
        ? existingUserFeedback.questions.concat(
            questions.map((text) => ({ _id: uuidv4(), text }))
          )
        : questions.map((text) => ({ _id: uuidv4(), text }));

      // Update the user's feedback in the database
      await adminFeedbackCollection.updateOne(
        { email: email },
        { $set: { questions: updatedQuestions } }
      );
    } else {
      // If the user doesn't exist, create a new user and insert their feedback
      const newUserFeedback = await adminFeedbackCollection.insertOne({
        username,
        email,
        questions: questions.map((text) => ({ _id: uuidv4(), text })),
      });
    }

    res.status(200).send("Admin feedback saved successfully");
  } catch (err) {
    console.error("Error saving admin feedback:", err);
    res.status(500).send("Error saving admin feedback");
  }
});

// Route to handle feedback submission
app.post("/submit-user-feedback", async (req, res) => {
  try {
    const { userName, email, feedback } = req.body;

    // Check if the email already exists in the database
    const existingUser = await userFeedbackCollection.findOne({ email });

    if (existingUser) {
      // If the user exists, update their feedback
      await userFeedbackCollection.updateOne(
        { email },
        { $push: { feedback: feedback } }
      );
    } else {
      // If the user doesn't exist, create a new feedback object
      const newFeedback = {
        userName,
        email,
        feedback: [feedback],
      };

      // Save the feedback to the database
      await userFeedbackCollection.insertOne(newFeedback);
    }

    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get user feedback route
app.get("/user-feedback/:email", async (req, res) => {
  try {
    const userEmail = req.params.email;

    // Find the user's feedback based on email
    const userFeedback = await adminFeedbackCollection.findOne({
      email: userEmail,
    });

    if (!userFeedback) {
      return res.status(404).send("No feedback found for the user");
    }

    // Send the feedback questions
    res.status(200).json({ questions: userFeedback.questions });
  } catch (err) {
    console.error("Error fetching user feedback:", err);
    res.status(500).send("Error fetching user feedback");
  }
});

app.post("/user-response", async (req, res) => {
  try {
    const { userEmail, feedback } = req.body;

    for (const item of feedback) {
      const { userId, questionId, response } = item;

      // Check if a record with the given userId exists
      const existingRecord = await userResponseCollection.findOne({ userId });

      if (existingRecord) {
        // Update the existing record with the new response
        await userResponseCollection.updateOne(
          { userId },
          {
            $push: {
              responses: { question_id: questionId, response: response },
            },
          }
        );
      } else {
        // Create a new record if no record exists for the userId
        await userResponseCollection.insertOne({
          userId: userId,
          responses: [{ question_id: questionId, response: response }],
        });
      }
    }

    res.status(201).json({ message: "User responses saved successfully" });
  } catch (error) {
    console.error("Error saving user responses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


const feedbackQuestions = [
  { text: 'How satisfied are you with the project?' },
  { text: 'Did you face any challenges during the week?' },
  { text : 'How effective was the communication within your team during the week?' },
  { text : 'Are there any areas where you believe improvement is needed in our processes or workflows?' },
  { text : 'Do you have any suggestions or ideas for enhancing team collaboration and efficiency?' }
  // Add more questions as needed
];


async function storeQuestionsForUser(userId, questions) {
  try {
    // Check if questions already exist for the user
    const existingQuestions = await questionCollection.findOne({ userId: userId });

    // If questions already exist, return without saving again
    if (existingQuestions) {
      console.log('Questions already exist for this user:', existingQuestions);
      return existingQuestions;
    }

    // Insert questions for the user if they don't already exist
    const result = await questionCollection.insertOne({ userId: userId, questions: questions });
    console.log('Stored questions:', result.ops);
    return result.ops;
  } catch (error) {
    console.error('Error storing questions:', error);
    throw error; // Propagate the error to the caller
  }
}


// Assuming you have a route handler to fetch user ID based on email
app.get('/userId', async (req, res) => {
  try {
    const userEmail = req.query.email;

    // Assuming you have a function to find the user by email and return their ID
    const user = await userCollection.findOne({ email: userEmail });

    console.log(user._id);

    if (user) {
      return res.json({ userId: user._id });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user ID:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Assuming you have a route handler to fetch questions based on user ID
app.get('/questions', async (req, res) => {
  try {
    const userid = req.query.userId;
    console.log(userid);
    // const questions = await questionCollection.findOne({ userId: userid });
    // console.log(questions);

    const questionsAll = await questionCollection.find();
    const questions = ((await questionsAll.toArray()).filter(q => q.userId.toString() === userid))[0];
    console.log(questions);

    return res.json(questions.questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


app.post('/submit-project-feedback', async (req, res) => {
  try {
    const { user, ratings, feedback } = req.body;

    // Find the user ID based on the email
    const userData = await userCollection.findOne({ email: user.email });
    if (!userData) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Find the question data based on the user ID
    const questionData = await questionCollection.findOne({ userId: userData._id });
    if (!questionData) {
      return res.status(400).json({ error: 'Question data not found' });
    }

    // Extract userId and questionId
    const userId = questionData.userId;
    const questionId = questionData._id;

    // Check if a record with the given questionId exists
    const existingRecord = await ratingCollection.findOne({ questionId });

    if (existingRecord) {
      // Update existing record
      await ratingCollection.updateOne(
        { questionId },
        { $set: { ratings, feedback } }
      );
    } else {
      // Insert new record
      await ratingCollection.insertOne({ userId, questionId, ratings, feedback });
    }

    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post("/timesheet-data", async (req, res) => {
  try {
    const timesheetData = req.body; // Assuming data is sent in the request body
    const userEmail = timesheetData.userEmail;

    const user = await userCollection.findOne({ email: userEmail });
    const userId = user._id;

    if(!user) {
      return res.status(400).json({message:"No such user found."}); // Return here to exit the function without continuing
    }

    const userName = user.firstname + ' ' + user.lastname;

    timesheetData.userName = userName;
    
    const timesheet = await timeSheetCollection.insertOne(timesheetData);
    const response = await res.json(timesheet); 
    if(response) {
      await storeQuestionsForUser(userId, feedbackQuestions);
    }
    return response;
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
