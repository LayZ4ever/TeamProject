const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();
app.use(bodyParser.json());

app.use(session({
    secret: 'your_secret_key', // Replace with a real secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using https
}));

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'd8zRJmDyVlAX8fHP',
    database: 'mydb',
};

const pool = mysql.createPool(dbConfig);

app.use(express.static('Autentication'));
app.use(express.static('Parcel'));

app.post('/api/register', async (req, res) => {
    try {
        const { username, password, firstName, lastName, phoneNumber } = req.body;

        // Connect to the database
        const connection = await pool.getConnection();

        // Check if username already exists
        const checkUserSql = 'SELECT * FROM users WHERE Username = ?';
        const [users] = await connection.query(checkUserSql, [username]);

        if (users.length > 0) {
            // Username already exists
            connection.release();
            return res.status(409).json({ message: 'Username already exists' });
        }

        // If username doesn't exist, proceed with registration
        const hashedPassword = await bcrypt.hash(password, 10);
        const insertUserSql = 'INSERT INTO users (Username, Password) VALUES (?, ?)';
        const [userResult] = await connection.query(insertUserSql, [username, hashedPassword]);
        const newUserId = userResult.insertId;

        // Combine first and last name for custName and insert into Customer table
        const custName = `${firstName} ${lastName}`;
        const insertCustomerSql = 'INSERT INTO customer (Users_UserId, CustName, PhoneNumber) VALUES (?, ?, ?)';
        await connection.query(insertCustomerSql, [newUserId, custName, phoneNumber]);

        // Release connection and send response
        connection.release();
        res.json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error in user registration' });
    }
});


// Login Route
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const connection = await pool.getConnection();
        const sql = 'SELECT * FROM users WHERE Username = ?';
        const [users] = await connection.query(sql, [username]);
        connection.release();

        if (users.length > 0) {
            const comparison = await bcrypt.compare(password, users[0].Password);
            if (comparison) {
                // Create a session
                req.session.userId = users[0].UserId;
                // req.session.username = users[0].Username;
                res.json({ success: true, message: 'Login successful' });
            } else {
                res.json({ success: false, message: 'Wrong username or password' });
            }
        } else {
            res.json({ success: false, message: 'User not found' });
        }
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Error logging in' });
    }
});


app.post('/api/insertData', async (req, res) => {
    try {
        const { senderId, receiverId, officeOrAddress, senderAddress, deliveryAddress, weight, price } = req.body;
        const connection = await pool.getConnection();
        const sql = 'INSERT INTO parcels (SenderId, ReceiverId, OfficeOrAddress, SenderAddress, DeliveryAddress, Weight, Price) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const [result] = await connection.query(sql, [senderId, receiverId, officeOrAddress, senderAddress, deliveryAddress, weight, price]);
        connection.release();
        res.json({ message: 'Data inserted successfully', insertId: result.insertId });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error inserting data' });
    }
});


app.get('/api/customerName', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Not logged in' });
    }

    try {
        const connection = await pool.getConnection();
        const sql = 'SELECT CustName FROM customer WHERE Users_UserId = ?';
        const [rows] = await connection.query(sql, [req.session.userId]);
        connection.release();

        if (rows.length > 0) {
            res.json({ custName: rows[0].CustName });
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error retrieving customer name' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
