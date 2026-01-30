const { google } = require('googleapis');

let auth;
try {
    let serviceAccountJson;
    try {
        serviceAccountJson = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT || '{}');
        if (serviceAccountJson.private_key && serviceAccountJson.private_key.includes('\\n')) {
            serviceAccountJson.private_key = serviceAccountJson.private_key.replace(/\\n/g, '\n');
        }
    } catch (parseError) {
        console.error('Error parsing service account JSON:', parseError);
        throw new Error('Invalid service account JSON format');
    }

    if (!serviceAccountJson.client_email || !serviceAccountJson.private_key) {
        throw new Error('Missing required service account credentials');
    }

    auth = new google.auth.JWT({
        email: serviceAccountJson.client_email,
        key: serviceAccountJson.private_key,
        scopes: ['https://www.googleapis.com/auth/drive']
    });
} catch (error) {
    console.error('Error initializing Google auth:', error);
}

const getDriveClient = async () => {
    try {
        if (!auth) throw new Error('Google auth not initialized');
        await auth.authorize();
        return google.drive({ version: 'v3', auth });
    } catch (error) {
        console.error('Error getting Drive client:', error);
        throw new Error(`Failed to initialize Google Drive client: ${error.message}`);
    }
};

module.exports = {
    auth,
    getDriveClient
};
