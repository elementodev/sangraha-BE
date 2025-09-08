import emailjs from '@emailjs/nodejs';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    // Your honeypot check
    // If the hidden 'website' field has a value, it's likely a bot.
    if (req.body.website) {
        console.warn('Spam detected via honeypot field.');
        return res.status(200).json({ message: 'Success' });
    }

    const { fullName, email, phone, message } = req.body;

    if (!fullName || !email || !phone || !message) {
        return res.status(400).json({ message: 'All form fields are required.' });
    }

    try {
        const templateParams = {
            from_name: fullName,
            from_email: email,
            phone: phone,
            message: message,
        };

        await emailjs.send(
            process.env.SERVICE_ID,
            process.env.TEMPLATE_ID,
            templateParams,
            {
                publicKey: process.env.PUBLIC_KEY,
                privateKey: process.env.PRIVATE_KEY,
            }
        );

        res.status(200).json({ message: 'Your message has been sent successfully!' });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send your message. Please try again later.' });
    }
}
