// Import dependencies
const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
// const api = require('./routes/index');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'poiuytrewq1!',
        database: 'myBusiness_db'
    },

    console.log(`Connected to the myBusiness_db database.`)
);

// Refer to and use API routes
// app.use('/api', api);







// Default response for any other request (not found)
app.use((req, res) => {
    res.status(404).end();
});

// Alerts user when server running
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} 🚀`);
});