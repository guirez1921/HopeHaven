const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');
const cors = require('cors');   // 👈 import cors
const { google } = require('googleapis');

const app = express();

// Enable CORS for all routes
app.use(cors());

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });
const auth = new google.auth.GoogleAuth({
  keyFile: 'service-account.json', // path to your service account JSON
  scopes: ['https://www.googleapis.com/auth/drive.file']
});

const uploadFields = upload.fields([
    { name: 'governmentIdFront', maxCount: 1 },
    { name: 'governmentIdBack', maxCount: 1 },
    { name: 'biodataImage', maxCount: 1 },
    { name: 'biodataVideo', maxCount: 1 },
    { name: 'randomPicture', maxCount: 1 }
]);

app.get('/', (req, res) => {
    res.status(200).send('✅ Express backend is running on Vercel!');
});

app.post('/submit', uploadFields, async (req, res) => {
    try {
        const body = req.body;
        const files = req.files;

        // Build attachments with field name as filename
        const attachments = [];
        for (const field in files) {
            const file = files[field][0];
            attachments.push({
                filename: field + path.extname(file.originalname),
                content: file.buffer
            });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: `New Submission from ${body.firstName} ${body.lastName}`,
            text: JSON.stringify(body, null, 2),
            attachments
        });

        res.status(200).send('Form submitted and email sent!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error processing submission');
    }
});

// Endpoint to get an access token
app.get('/get-token', async (req, res) => {
  try {
    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    res.json({ access_token: tokenResponse.token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get token' });
  }
});

// Export as Vercel serverless function
module.exports = app;