const nodemailer = require('nodemailer');
const express = require('express');
const router = express.Router();

router.post('/send-email', async (req, res) => {
    try {
        const { email, password, link } = req.body;

        // Create a transporter object using SMTP transport
        const transporter = nodemailer.createTransport({
            host: 'smtp-mail.outlook.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: 'mutukundu@jmangroup.com',
                pass: 'Jman@600113'
            }
        });

        // Email content
        const mailOptions = {
            from: 'mutukundu@jmangroup.com',
            to: email,
            subject: 'Account Created',
            text: `Your account has been created successfully. Your temporary password is: ${password}. Please use this password to log in and ${link} use this link to reset your password.`,
            html: `<p>Your account has been created successfully.Your temporary password is: <strong>${password}</strong>. Please use this password to log in and ${link} use this link to  reset your password.</p>`
        };

        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                res.status(500).send('Error sending email');
                
            } else {
                console.log('Email sent:', info.response);
                res.status(200).send('Email sent successfully');
            }
        });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email');
    }
});

module.exports = router;
