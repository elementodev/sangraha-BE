const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const emailjs = require('@emailjs/nodejs');

require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors());

app.use(bodyParser.json());

emailjs.init({
    publicKey: process.env.PUBLIC_KEY,
    privateKey: process.env.PRIVATE_KEY
});

app.post('/api/send-email', (req, res) => {
    const { fullName, email, phone, message, website } = req.body;

    if (website && website.trim() !== '') {
        return res.status(400).json({ message: 'Spam detected.' });
    }

    if (!fullName || !email || !phone || !message) {
        return res.status(400).json({ message: 'All form fields are required.' });
    }

    const templateParams = {
        from_name: fullName,
        from_email: email,
        phone: phone,
        message: message,
    };

    emailjs.send(
        process.env.SERVICE_ID,
        process.env.TEMPLATE_ID,
        templateParams
    )
    .then((response) => {
        console.log('Email successfully sent!', response.status, response.text);
        res.status(200).json({ message: 'Your message has been sent successfully!' });
    })
    .catch((error) => {
        console.error('Email sending failed...', error);
        res.status(500).json({ message: 'Failed to send your message. Check server console for details.' });
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
