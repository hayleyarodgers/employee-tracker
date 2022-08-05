// Import dependencies
const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'poiuytrewq1!',
        database: 'business_db'
    },

    console.log(`Connected to the business_db database.`)
);

// Questions user is asked in CLI
const welcome = () => {
    console.log(`

Welcome to the employee tracker! 👋`);
}

const respondToUserInputs = () => {
    /* VIEW DATABASE */
    // View all departments
    const viewAllDepartments = () => {
        sql = `SELECT id, name FROM departments`;
        
        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
            }

            console.table(result);
            decisionInput();
        });
    }
    
    // View all roles
    const viewAllRoles = () => {
        const sql = `SELECT roles.id as id, roles.title as title, departments.name as department, roles.salary as salary FROM roles JOIN departments ON roles.department_id = departments.id;`;
        
        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
            }

            console.table(result);
            decisionInput();
        });
    }

    // View all employees
    const viewAllEmployees = () => {
        const sql = `SELECT employees.id AS id, employees.first_name AS first_name, employees.last_name AS last_name, roles.title AS title, departments.name AS department, roles.salary AS salary, employees.manager_id AS manager FROM employees JOIN roles ON employees.role_id = roles.id JOIN departments ON roles.department_id = departments.id;`;
        
        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
            }

            console.table(result);
            decisionInput();
        });
    }
    
    /* ADD TO DATABASE */
    // Add a department
    const addDepartment = () => {
        inquirer
        .prompt([
            {
                type: 'input',
                name: 'name',
                message: 'What is the name of the department?'
            }
        ])
        .then((answers) => {
            const sql = `INSERT INTO departments (name) VALUES (?)`;
            const params = answers.name;
            
            db.query(sql, params, (err, result) => {
                if (err) {
                    console.log(err);
                }
    
                decisionInput();
            });
        });
    }
    
    // Add a role
    const addRole = () => {
        inquirer
        .prompt([
            {
                type: 'input',
                name: 'title',
                message: 'What is the title of the role?'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary of the role?'
            },
            {
                type: 'list',
                name: 'department',
                message: 'Which department does the role belong to?',
                choices: []
                // Need to get departments from database to make the choices
            }
        ])
        .then((answers) => {
            const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?)`;
            // const params = answers.title, answers.salary, ;
            
            db.query(sql, params, (err, result) => {
                if (err) {
                    console.log(err);
                }
    
                decisionInput();
            });
        });
    }

    // Add an employee
    const addEmployee = () => {
        inquirer
        .prompt([
            {
                type: 'input',
                name: 'firstName',
                message: 'What is the employee\'s first name?'
            },
            {
                type: 'input',
                name: 'lastName',
                message: 'What is the employee\'s last name?'
            },
            {
                type: 'list',
                name: 'role',
                message: 'What is the employee\'s role?',
                choices: []
                // Need to get roles from database to make the choices
            },
            {
                type: 'list',
                name: 'manager',
                message: 'Who is the employee\'s manager?',
                choices: []
                // Need to get managers from database to make the choices
            }
        ])
        .then((answers) => {
            // need to add new employee to database
            decisionInput();
        });
    }

    /* UPDATE DATABASE */
    // Change an employee's role
    const updateEmployeeRole = () => {
        inquirer
        .prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Which employee\'s role do you want to update?',
                choices: []
                // Need to get employees from database to make the choices
            },
            {
                type: 'list',
                name: 'newRole',
                message: 'Which role do you want to assign the selected employee?',
                choices: []
                // Need to get roles from database to make the choices
            }
        ])
        .then((answers) => {
            // need to change employee's role to database
            decisionInput();
        });
    }

        /* DECISION */
        // User says what they want to do
        const decisionInput = () => {
            inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'decision',
                    message: 'What would you like to do?',
                    choices: ['View all departments',
                              'View all roles',
                              'View all employees',
                              'Add a department',
                              'Add a role',
                              'Add an employee',
                              'Update an employee\'s role',
                              'Quit'],
                }
            ])
            .then((answers) => {        
                if (answers.decision === 'View all departments') {
                    viewAllDepartments();
                } else if (answers.decision === 'View all roles') {
                    viewAllRoles();
                } else if (answers.decision === 'View all employees') {
                    viewAllEmployees();
                } else if (answers.decision === 'Add a department') {
                    addDepartment();
                } else if (answers.decision === 'Add a role') {
                    addRole();
                } else if (answers.decision === 'Add an employee') {
                    addEmployee();
                } else if (answers.decision === 'Update an employee\'s role') {
                    updateEmployeeRole();
                } else {
                    console.log('Thanks for using the employee tracker, bye! 👋');
                    return
                }
            });
        }
    
        decisionInput();
}

// Initialise app
const init = () => {
    welcome();
    respondToUserInputs();
}

init();