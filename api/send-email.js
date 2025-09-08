import emailjs from '@emailjs/nodejs';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    // This is the honey pot check from your HTML
    if (req.body.website) {
        return res.status(400).json({ message: 'Spam detected.' });
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
            process.env.Service_ID,
            process.env.Template_ID,
            templateParams,
            {
                publicKey: process.env.Public_Key,
                privateKey: process.env.Private_Key,
            }
        );

        res.status(200).json({ message: 'Your message has been sent successfully!' });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send your message. Please try again later.' });
    }
}