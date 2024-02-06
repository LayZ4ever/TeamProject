const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();
app.use(express.json());

app.use(session({
    secret: 'your_secret_key', // Replace with a real secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using https
}));

const dbConfig = require('./dbConfig');

const pool = mysql.createPool(dbConfig);

app.use(express.static('Authentication'));
app.use(express.static('Parcel'));
app.use(express.static('Moderator'));

/* ------------------------------------ LOGIN AND REGISTRATION ------------------------------------ */

// Registration
app.post('/api/register', async (req, res) => {
    let connection;

    try {
        const { username, password, firstName, lastName, phoneNumber } = req.body;

        // Connect to the database
        connection = await pool.getConnection();

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
    } finally {
        if (connection) {
            connection.release();
        }
    }
});


// Login
app.post('/api/login', async (req, res) => {
    let connection;

    try {
        const { username, password } = req.body;

        connection = await pool.getConnection();
        const sql = 'SELECT * FROM users WHERE Username = ?';
        const [users] = await connection.query(sql, [username]);
        connection.release();
        if (users.length > 0) {
            const comparison = await bcrypt.compare(password, users[0].Password);
            if (comparison) {
                req.session.userId = users[0].UserId;
                req.session.roleId = users[0].RoleId;
                res.json({ success: true, message: 'Login successful', roleId: req.session.roleId });
            } else {
                res.json({ success: false, message: 'Wrong username or password' });
            }
        } else {
            res.json({ success: false, message: 'User not found' });
        }

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Error logging in' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

app.post('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            res.json({ success: false, message: 'Logout failed' });
        } else {
            res.clearCookie('connect.sid');
            res.json({ success: true, message: 'Logged out successfully' });
        }
    });
});
/* ------------------------------------------------------------------------------------------------ */


/* ----------------------------------------- SESSION CHECK ---------------------------------------- */

app.get('/api/checkSession', (req, res) => {
    if (req.session.userId) {
        res.json({ loggedIn: true, roleId: req.session.roleId, userId: req.session.userId });
    } else {
        res.json({ loggedIn: false });
    }
});
/* ------------------------------------------------------------------------------------------------- */



app.get('/api/search-customer', async (req, res) => {
    let connection;

    try {
        const { phoneNumber } = req.query;

        connection = await pool.getConnection();
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
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

app.post('/api/create-or-update-customer', async (req, res) => {
    let connection;

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
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

//this inserts into the DB
app.post('/api/insertData', async (req, res) => {
    let connection;

    try {
        const { SenderId, ReceiverId, officeOrAddress, senderAddress, receiverAddress, Weight, Price, DispachDate, ReceiptDate, StatusId, StatusDate, EmpId, PaidOn } = req.body;
        connection = await pool.getConnection();
        const sql = 'INSERT INTO parcels (SenderId, ReceiverId, OfficeOrAddress, SenderAddress, ReceiverAddress, Weight, Price, DispachDate, ReceiptDate, StatusId, StatusDate, EmpId, PaidOn) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const [result] = await connection.query(sql, [SenderId, ReceiverId, officeOrAddress, senderAddress, receiverAddress, Weight, Price, DispachDate, ReceiptDate, StatusId, StatusDate, EmpId, PaidOn]);
        connection.release();
        res.json({ message: 'Data inserted successfully', insertId: result.insertId });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error inserting data' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});




app.get('/api/getCustomerId', async (req, res) => {
    let connection;

    try {
        const phoneNumber = req.query.phone;

        connection = await pool.getConnection();
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
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

app.get('/parcels', async (req, res) => {
    let connection;

    try {
        connection = await pool.getConnection();
        const sql = 'SELECT p.*, s.CustName AS SenderName, r.CustName AS ReceiverName, t.EmpName AS EmployeeName, q.StatusName AS StatusName FROM parcels p JOIN customer s ON p.SenderId = s.CustId JOIN customer r ON p.ReceiverId = r.CustId JOIN employees t ON p.EmpId = t.EmpId JOIN statuses q ON p.StatusId = q.StatusId';
        const [rows] = await connection.query(sql);
        res.json(rows);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error fetching employees data' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

app.get('/sortedParcels', async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const sortingAttribute = req.query.sortingAttribute || 'ParcelsId';
        const sql = `SELECT p.*, s.CustName AS SenderName, r.CustName AS ReceiverName, t.EmpName AS EmployeeName, q.StatusName AS StatusName FROM parcels p JOIN customer s ON p.SenderId = s.CustId JOIN customer r ON p.ReceiverId = r.CustId JOIN employees t ON p.EmpId = t.EmpId JOIN statuses q ON p.StatusId = q.StatusId ORDER BY ${sortingAttribute}`;
        const [rows] = await connection.query(sql);
        res.json(rows);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error fetching parcels data' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});


/* ------------------------------------------- Employees ------------------------------------------- */



app.get('/api/getEmpIdAndName', async (req, res) => {
    if (req.session.userId) {
        let emp = await getEmpNameIdFromUserID(req.session.userId); //added await, and that's how I got the value, instead of the promise
        let empId = emp.EmpId;
        let empName = emp.EmpName; //have to show the name
        // console.log(empId);
        res.json({ empId: empId, empName: empName });
    } else {
        res.json({ loggedIn: false });
    }
});


// //Function that gets userId from session, not needed - created a new endpoint
// function getUserIdFromSession() {
//     fetch('/api/checkSession')
//         .then(response => response.json())
//         .then(data => {
//             if (data.loggedIn) {
//                 userID = data.userId;
//                 // console.log(userID);
//                 return userID; //works
//             }
//         })
//         .catch(error => console.error('Error:', error));
// };
// console.log("getEmpIdFromUserId:" +getEmpIdFromUserID(100));

// function getEmpIdFromSession() {
//     return getEmpIdFromUserID(getUserIdFromSession());
// }



//Function that gets empId from userId
async function getEmpNameIdFromUserID(userId) {
    connection = await pool.getConnection();
    const sql = 'SELECT * FROM employees WHERE UserId = ?';
    const [employee] = await connection.query(sql, [userId]);
    connection.release();

    let empId = employee[0];
    // console.log(empId); //it works here
    return empId;
}



//Employees data
app.get('/employees', async (req, res) => {
    let connection;

    try {
        connection = await pool.getConnection();
        const sql = 'SELECT * FROM employees';
        const [rows] = await connection.query(sql);
        res.json(rows);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error fetching employees data' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

app.get('/sortedEmployees', async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const sortingAttribute = req.query.sortingAttribute || 'EmpId';
        const sql = `SELECT * FROM employees ORDER BY ${sortingAttribute}`;
        const [rows] = await connection.query(sql);
        res.json(rows);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error fetching employees data' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

// Helper function to generate a username for the employees
function generateUsername(fullName) {
    var nameParts = fullName.trim().split(/\s+/);
    if (nameParts.length < 3) {
        console.error('Name does not have three parts:', fullName);
        return null;
    }
    var username = nameParts[0].charAt(0) + nameParts[1].charAt(0) + nameParts[2];
    return username;
}

// Helper function to ensure username uniqueness for the employees
async function getUniqueUsername(connection, baseUsername, suffix = 0) {
    let testUsername = suffix === 0 ? baseUsername : `${baseUsername}${suffix}`;
    const [users] = await connection.query('SELECT Username FROM users WHERE Username = ?', [testUsername]);
    if (users.length > 0) {
        return await getUniqueUsername(connection, baseUsername, suffix + 1);
    }
    return testUsername;
}

// Add a new employee
app.post('/api/addEmployee', async (req, res) => {
    let connection;
    const { EmpName, EmpType } = req.body;
    const defaultPassword = 'LogComp'; // Default password, consider using a more secure approach

    try {
        connection = await pool.getConnection();

        // Generate and check the uniqueness of the username
        let username = generateUsername(EmpName);
        if (!username) {
            res.json({ success: false, message: 'Invalid employee name format' });
            return;
        }
        username = await getUniqueUsername(connection, username);

        // Hash the default password
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        // Insert new user
        const insertUserSql = 'INSERT INTO users (RoleId, Username, Password) VALUES (3, ?, ?)';
        const [userResult] = await connection.query(insertUserSql, [username, hashedPassword]);
        const newUserId = userResult.insertId;

        // Insert new employee
        const insertEmpSql = 'INSERT INTO employees (EmpName, EmpType, UserId) VALUES (?, ?, ?)';
        await connection.query(insertEmpSql, [EmpName, EmpType, newUserId]);
        connection.release();

        res.json({ success: true, newUsername: username });
    } catch (error) {
        console.error('Error adding employee:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

app.post('/api/updateEmployee', async (req, res) => {
    let connection;
    const { EmpId, EmpName, EmpType } = req.body;

    try {
        connection = await pool.getConnection();
        const updateSql = 'UPDATE employees SET EmpName = ?, EmpType = ? WHERE EmpId = ?';
        await connection.query(updateSql, [EmpName, EmpType, EmpId]);
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating employee:', error);
        res.json({ success: false });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

// API endpoint to delete an employee and their user account
app.delete('/api/deleteEmployee', async (req, res) => {
    const { empId } = req.body;

    if (!empId) {
        return res.status(400).send({ success: false, message: 'Employee ID is required.' });
    }
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        await connection.beginTransaction();

        // Get the UserId associated with the employee
        const [user] = await connection.execute('SELECT UserId FROM employees WHERE EmpId = ?', [empId]);
        if (user.length === 0) {
            await connection.rollback();
            return res.status(404).send({ success: false, message: 'Employee not found.' });
        }
        const userId = user[0].UserId;

        // Delete the employee
        const [deleteEmp] = await connection.execute('DELETE FROM employees WHERE EmpId = ?', [empId]);
        if (deleteEmp.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).send({ success: false, message: 'Employee not found.' });
        }

        // Delete the user
        const [deleteUser] = await connection.execute('DELETE FROM users WHERE UserId = ?', [userId]);
        if (deleteUser.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).send({ success: false, message: 'User not found.' });
        }

        await connection.commit();
        res.send({ success: true, message: 'Employee and user deleted successfully.' });
        await connection.end();
    } catch (error) {
        console.error('Error in deleting employee:', error);
        await connection.rollback();
        res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
});



/* ------------------------------------------- Customer ------------------------------------------- */

//Customer data
app.get('/customers', async (req, res) => {
    let connection;

    try {
        connection = await pool.getConnection();
        const sql = 'SELECT * FROM customer';
        const [rows] = await connection.query(sql);
        res.json(rows);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error fetching customers data' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

// Helper function to check if the customer has 2 names
function checkName(fullName) {
    var nameParts = fullName.trim().split(/\s+/);
    if (nameParts.length != 2) {
        console.error('Name does not have two parts:', fullName);
        return false;
    }
    return true;
}

// Add a new customer
app.post('/api/addCustomer', async (req, res) => {
    let connection;
    const { CustName, PhoneNumber, Address } = req.body;

    try {
        connection = await pool.getConnection();

        // Check the name of the costumer
        let name = checkName(CustName);
        if (!name) {
            res.json({ success: false, message: 'Invalid customer name format' });
            return;
        }

        // Insert new customer
        const insertCustSql = 'INSERT INTO customer (CustName, PhoneNumber, Address) VALUES (?, ?, ?)';
        await connection.query(insertCustSql, [CustName, PhoneNumber, Address]);
        connection.release();

        res.json({ success: true });
    } catch (error) {
        console.error('Error adding customer:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

app.post('/api/updateCustomer', async (req, res) => {
    let connection;
    const { CustId, CustName, PhoneNumber, Address } = req.body;

    try {
        connection = await pool.getConnection();
        const updateSql = 'UPDATE customer SET CustName = ?, PhoneNumber = ?, Address = ? WHERE CustId = ?';
        await connection.query(updateSql, [CustName, PhoneNumber, Address, CustId]);
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating customer:', error);
        res.json({ success: false });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

// API endpoint to delete an customer and their user account
app.delete('/api/deleteCustomer', async (req, res) => {
    const { custId } = req.body;

    if (!custId) {
        return res.status(400).send({ success: false, message: 'Customer ID is required.' });
    }
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        await connection.beginTransaction();

        // Get the UserId associated with the customer
        const [user] = await connection.execute('SELECT UserId FROM customer WHERE CustId = ?', [custId]);
        if (user.length === 0) {
            await connection.rollback();
            return res.status(404).send({ success: false, message: 'Customer not found.' });
        }
        const userId = user[0].UserId;

        // Delete the customer
        const [deleteCust] = await connection.execute('DELETE FROM customer WHERE CustId = ?', [custId]);
        if (deleteCust.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).send({ success: false, message: 'Customer not found.' });
        }

        // Delete the user
        const [deleteUser] = await connection.execute('DELETE FROM users WHERE UserId = ?', [userId]);

        await connection.commit();
        res.send({ success: true, message: 'Customer deleted successfully.' });
        await connection.end();
    } catch (error) {
        console.error('Error in deleting customer:', error);
        await connection.rollback();
        res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
});


app.get('/sortedCustomers', async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const sortingAttribute = req.query.sortingAttribute || 'CustId';
        const sql = `SELECT * FROM customer ORDER BY ${sortingAttribute}`;
        const [rows] = await connection.query(sql);
        res.json(rows);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error fetching customers data' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

/* ------------------------------------------- Office ------------------------------------------- */

//Office data
app.get('/offices', async (req, res) => {
    let connection;

    try {
        connection = await pool.getConnection();
        const sql = 'SELECT * FROM offices';
        const [rows] = await connection.query(sql);
        res.json(rows);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error fetching offices data' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});


// Add a new office
app.post('/api/addOffice', async (req, res) => {
    let connection;
    const { OfficeName, OfficeAddress } = req.body;

    try {
        connection = await pool.getConnection();

        // Insert new office
        const insertOfficeSql = 'INSERT INTO offices (Firm_FirmId, OfficeName, OfficeAddress) VALUES (1, ?, ?)';
        await connection.query(insertOfficeSql, [OfficeName, OfficeAddress]);
        connection.release();

        res.json({ success: true });
    } catch (error) {
        console.error('Error adding office:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

app.post('/api/updateOffice', async (req, res) => {
    let connection;
    const { OfficeId, OfficeName, OfficeAddress } = req.body;

    try {
        connection = await pool.getConnection();
        const updateSql = 'UPDATE offices SET OfficeName = ?, OfficeAddress = ? WHERE OfficeId = ?';
        await connection.query(updateSql, [OfficeName, OfficeAddress, OfficeId]);
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating office:', error);
        res.json({ success: false });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

// API endpoint to delete an office
app.delete('/api/deleteOffice', async (req, res) => {
    const { officeId } = req.body;

    if (!officeId) {
        return res.status(400).send({ success: false, message: 'Office ID is required.' });
    }
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        await connection.beginTransaction();

        // Delete the office
        const [deleteOffice] = await connection.execute('DELETE FROM offices WHERE OfficeId = ?', [officeId]);
        if (deleteOffice.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).send({ success: false, message: 'Office not found.' });
        }

        await connection.commit();
        res.send({ success: true, message: 'Office deleted successfully.' });
        await connection.end();
    } catch (error) {
        console.error('Error in deleting office:', error);
        await connection.rollback();
        res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
});

app.get('/sortedOffices', async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const sortingAttribute = req.query.sortingAttribute || 'OfficeId';
        const sql = `SELECT * FROM offices ORDER BY ${sortingAttribute}`;
        const [rows] = await connection.query(sql);
        res.json(rows);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error fetching offices data' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

/* ------------------------------------------- Firm ------------------------------------------- */
app.get('/firm', async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const sql = 'SELECT * FROM firm';
        const [row] = await connection.query(sql);
        if (row.length > 0) {
            res.json(row); // Send the first result
        } else {
            res.status(404).json({ message: 'No firm found' });

        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error fetching firm data' });
        return;
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

app.post('/firm/update', async (req, res) => {
    const { FirmName, FirmAddress } = req.body;
    if (!FirmName || !FirmAddress) {
        // 400 - bad request
        res.status(400).json({ success: false, message: 'Both FirmName and FirmAddress are required.' });
        return;
    }

    let connection;
    try {
        connection = await pool.getConnection();
        const updateSql = 'UPDATE firm SET FirmName = ?, FirmAddress = ?';
        await connection.query(updateSql, [FirmName, FirmAddress]);

        res.json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        res.json({ success: false, message: 'Error updating firm data' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

/* ------------------------------------------------------------------------------------------------- */
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});