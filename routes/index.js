const express = require('express');

// Import modular routers for /departments, /roles and /employees
const departmentsRouter = require('./departments');
const rolesRouter = require('./roles');
const employeesRouter = require('./employees');

const app = express();

app.use('/departments', departmentsRouter);
app.use('/roles', rolesRouter);
app.use('/employees', employeesRouter);

module.exports = app;