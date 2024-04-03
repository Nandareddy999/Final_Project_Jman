const express = require("express");
const bcrypt = require("bcrypt");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid"); // Import UUID generator
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');

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
  timeSheetCollection;

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

    const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
    
    console.log('Generated OTP:', otp);

    const mailOptions = {
      from: 'mutukundu@jmangroup.com',
      to: email,
      subject: 'Account Created',
      text: `Hello User password reset has been on progress. Your otp is: ${otp}\n\n Please use this otp and reset your password.`,
      html: `<p>Hello User password reset has been on progress. Your otp is:  <strong>${otp}</strong>. Please use this otp and reset your password.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.error('Error sending email:', error);
          res.status(500).json({ error: 'Error sending email' });
      } else {
          console.log('Email sent:', info.response);
          res.status(200).json({ message: 'Email sent successfully' });
      }
    });


    // Respond with success message
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error("Error Sending Otp:", error);
    res.status(500).json({ error: "Error Sending Otp" });
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

app.post("/timesheet-data", async (req, res) => {
  try {
    const timesheetData = req.body; // Assuming data is sent in the request body
    const timesheet = await timeSheetCollection.insertOne(timesheetData);
    res.json(timesheet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
