const express = require('express');
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const Mail = require('./Mail');

const app = express();
app.use(require('cors')());
app.use(bodyParser.json());

const port = process.env.PORT || 5000;

// MongoDB Connection URI
const uri =
  'mongodb+srv://NandaKumar:Nandareddy%40123@cluster0.s9jwc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Create a new MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
let db, adminCollection, userCollection;

client
  .connect()
  .then(() => {
    console.log('Connected to MongoDB');
    db = client.db('CustomerData');
    adminCollection = db.collection('AdminData');
    userCollection = db.collection('UserData');
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

// Express Routes
// Insert admin data into the collection
app.post('/admin', async (req, res) => {
  try {
    const result = await adminCollection.insertOne(req.body);
    res.send(result);
  } catch (error) {
    console.error('Error inserting admin data:', error);
    res.status(500).send('Error inserting admin data');
  }
});

// Get all admin data
app.get('/admin', async (req, res) => {
  try {
    const data = await adminCollection.find({}).toArray();
    res.send(data);
  } catch (error) {
    console.error('Error getting admin data:', error);
    res.status(500).send('Error getting admin data');
  }
});

// Insert user data into the collection
app.post('/user', async (req, res) => {
  try {
    const { firstname, lastname, email, password, role } = req.body;

    // Check if the user already exists in the database
    const existingUser = await userCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).send('User already exists');
    }

    const salt = await bcrypt.genSalt();
    const hashedpassword = await bcrypt.hash(password, salt);
    const result = await userCollection.insertOne({ firstname, lastname, email, password: hashedpassword, role });

    res.send(result);
  } catch (error) {
    console.error('Error inserting user data:', error);
    res.status(500).send('Error inserting user data');
  }
});

// Get all user data
app.get('/user', async (req, res) => {
  try {
    const data = await userCollection.find({}).toArray();
    res.send(data);
  } catch (error) {
    console.error('Error getting user data:', error);
    res.status(500).send('Error getting user data');
  }
});

app.get('/userEmail', async (req, res) => {
    const userEmail = req.query.email; // Access email parameter from query string
    try {
        const user = await userCollection.findOne({ email: userEmail });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Admin login route
// app.post('/admin/login', async (req, res) => {
//     try {
//       const { email, password } = req.body;
  
//       // Check if the user exists in the admin collection
//       const admin = await adminCollection.findOne({ email });
  
//       if (!admin) {
//         return res.status(404).json({ error: 'Admin not found' });
//       }
  
//       // Compare passwords
//       const passwordMatch = await bcrypt.compare(password, admin.password);
  
//       if (!passwordMatch) {
//         return res.status(401).json({ error: 'Invalid password' });
//       }
  
//       // Successful login
//       res.status(200).json({ message: 'Admin login successful' });
//     } catch (error) {
//       console.error('Error logging in:', error);
//       res.status(500).json({ error: 'Error logging in' });
//     }
//   });

app.post('/admin/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if the user exists in the admin collection
      const admin = await adminCollection.findOne({ email });
  
      if (!admin) {
        return res.status(404).json({ error: 'Admin not found' });
      }
  
      // Assuming the password is already hashed in the database
      const hashedPassword = admin.password;
  
      // Perform comparison without decryption
      if (password !== hashedPassword) {
        return res.status(401).json({ error: 'Invalid password' });
      }
  
      // Successful login
      res.status(200).json({ message: 'Admin login successful' });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'Error logging in' });
    }
  });
  
  
  // User login route
  app.post('/user/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if the user exists in the user collection
      const user = await userCollection.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Compare passwords
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid password' });
      }
  
      // Successful login
      res.status(200).json({ message: 'User login successful' });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'Error logging in' });
    }
  });
  
  

app.post('/update-password', async (req, res) => {
  try {
    const { newPassword, newemail } = req.body;

    // Find the user based on the provided email
    const user = await userCollection.findOne({ email });

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Update the user's password
    user.password = newPassword;
    user.email = newemail;
    await user.save();

    // Send success response
    res.status(200).send('Password updated successfully');
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).send('Error updating password');
  }
});

app.use('', Mail);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
