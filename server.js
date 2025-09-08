const emailjs = require('@emailjs/nodejs');

emailjs.init({
    publicKey: process.env.PUBLIC_KEY,
    privateKey: process.env.PRIVATE_KEY
});

module.exports = async (req, res) => {
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return res.status(200).send();
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
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

        const response = await emailjs.send(
            process.env.SERVICE_ID,
            process.env.TEMPLATE_ID,
            templateParams
        );

        console.log('Email successfully sent!', response.status, response.text);
        res.status(200).json({ message: 'Your message has been sent successfully!' });

    } catch (error) {
        console.error('Email sending failed...', error);
        res.status(500).json({ message: 'Failed to send your message. Check server logs for details.' });
    }
};
