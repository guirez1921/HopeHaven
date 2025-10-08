const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');
const cors = require('cors');   // 👈 import cors

const app = express();

// Enable CORS for all routes
app.use(cors());

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

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

// Export as Vercel serverless function
module.exports = app;