const express = require('express');
const bcrypt = require( 'bcrypt' );
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
const Mail = require('./Mail');

const app = express();
app.use(require('cors')());
const port = process.env.PORT || 5000;

// Middleware for parsing JSON data
app.use(bodyParser.json());

// MongoDB Connection URI
const uri = 'mongodb+srv://NandaKumar:Nandareddy%40123@cluster0.s9jwc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Create a new MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect().then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => { 
    console.log(err);
})
// Connect to MongoDB
// client.connect(err => {
//     if (err) {
//         console.error('Error connecting to MongoDB:', err);
//         return;
//     }
//     console.log('Connected to MongoDB');

//     // Specify the database
    
// });
const db = client.db('CustomerData');
    const adminCollection = db.collection('AdminData');
    const userCollection = db.collection('UserData');

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
            const {firstname, lastname, email, password} = req.body;
            
            const salt = await bcrypt.genSalt();
            const hashedpassword = await bcrypt.hash(password, salt);
            const result = await userCollection.insertOne({firstname, lastname, email, password: hashedpassword});
            
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

    app.post('/update-password', async (req, res) => {
        try {
            const { token, newPassword, newemail } = req.body;

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

    app.use('',Mail);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
