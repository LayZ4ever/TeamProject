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

app.use(express.static('Authentication'));
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

        // Check if customer with the same name and phone number exists
        const custName = `${firstName} ${lastName}`;
        const checkCustomerSql = 'SELECT * FROM customer WHERE CustName = ? AND PhoneNumber = ?';
        const [customers] = await connection.query(checkCustomerSql, [custName, phoneNumber]);

        let newUserId;

        if (customers.length > 0) {
            // Customer exists, so link new user to existing customer
            const hashedPassword = await bcrypt.hash(password, 10);
            const insertUserSql = 'INSERT INTO users (Username, Password) VALUES (?, ?)';
            const [userResult] = await connection.query(insertUserSql, [username, hashedPassword]);
            newUserId = userResult.insertId;

            // Update the existing customer record with the new user ID
            const updateCustomerSql = 'UPDATE customer SET UserId = ? WHERE CustName = ? AND PhoneNumber = ?';
            await connection.query(updateCustomerSql, [newUserId, custName, phoneNumber]);
        } else {
            // No existing customer, create new user and customer
            const hashedPassword = await bcrypt.hash(password, 10);
            const insertUserSql = 'INSERT INTO users (Username, Password) VALUES (?, ?)';
            const [userResult] = await connection.query(insertUserSql, [username, hashedPassword]);
            newUserId = userResult.insertId;

            // Insert into Customer table
            const insertCustomerSql = 'INSERT INTO customer (UserId, CustName, PhoneNumber) VALUES (?, ?, ?)';
            await connection.query(insertCustomerSql, [newUserId, custName, phoneNumber]);
        }

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

app.get('/api/search-customer', async (req, res) => {
    try {
        const { phoneNumber } = req.query;

        const connection = await pool.getConnection();
        const sql = 'SELECT * FROM customer WHERE PhoneNumber = ?';
        const [customer] = await connection.query(sql, [phoneNumber]);
        connection.release();

        if (customer.length > 0) {
            res.json({ success: true, customer: customer[0] });
        } else {
            res.json({ success: false });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Error searching for customer' });
    }
});

app.post('/api/create-or-update-customer', async (req, res) => {
    try {
        const { CustName, PhoneNumber, Address } = req.body;

        // Check if customer exists
        const [existingCustomer] = await pool.query('SELECT * FROM customer WHERE PhoneNumber = ?', [PhoneNumber]);

        if (existingCustomer.length > 0) {
            // Customer exists, update their details
            await pool.query('UPDATE customer SET CustName = ?, Address = ? WHERE PhoneNumber = ?', [CustName, Address, PhoneNumber]);
            res.json({ success: true, message: 'Customer updated successfully' });
        } else {
            // No customer found, create new
            await pool.query('INSERT INTO customer (CustName, PhoneNumber, Address) VALUES (?, ?, ?)', [CustName, PhoneNumber, Address]);
            res.json({ success: true, message: 'Customer created successfully' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error processing request' });
    }
});

app.post('/api/insertData', async (req, res) => {
    try {
        const { SenderId, ReceiverId, officeOrAddress, senderAddress, receiverAddress, Weight, Price } = req.body;
        const connection = await pool.getConnection();
        const sql = 'INSERT INTO parcels (SenderId, ReceiverId, OfficeOrAddress, SenderAddress, ReceiverAddress, Weight, Price) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const [result] = await connection.query(sql, [SenderId, ReceiverId, officeOrAddress, senderAddress, receiverAddress, Weight, Price]);
        connection.release();
        res.json({ message: 'Data inserted successfully', insertId: result.insertId });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error inserting data' });
    }
});

app.get('/api/getCustomerId', async (req, res) => {
    try {
        const phoneNumber = req.query.phone;

        const connection = await pool.getConnection();
        const sql = 'SELECT CustId FROM customer WHERE PhoneNumber = ?';
        const [rows] = await connection.query(sql, [phoneNumber]);
        connection.release();

        if (rows.length > 0) {
            res.json({ customerId: rows[0].CustId });
        } else {
            res.json({ message: 'Customer not found', customerId: null });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error fetching customer ID' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
