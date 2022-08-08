/* JS DIRECTORY
    1. =APP-SETUP
    2. =PROMPTS
        2.1 =VIEW-DATABASE
        2.2 =ADD-TO-DATABASE
        2.3 =DELETE-FROM-DATABASE
        2.4 =UPDATE-DATABASE
        2.5 =USER-DECISION
    3. =HELPER-FUNCTIONS
    4. =INITIALISATION
*/


/* ===APP-SETUP=== */

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


/* ===PROMPTS=== */

// Questions user is asked in CLI
const welcome = () => {
    console.log(`

Welcome to the employee tracker! 👋`);
}

const respondToUserInputs = () => {
    
    
    /* ===VIEW-DATABASE=== */

    // View all departments
    const viewAllDepartments = () => {
        const sql = `SELECT id, name FROM departments`;
        
        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
            };

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
            };

            console.table(result);
            decisionInput();
        });
    }

    // View all employees
    const viewAllEmployees = () => {
        const sql = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employees e LEFT JOIN roles r ON e.role_id = r.id LEFT JOIN departments d ON r.department_id = d.id LEFT JOIN employees m ON m.id = e.manager_id`;

        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
            };

            console.table(result);
            decisionInput();
        });
    }
    
    // View employees by manager
    const viewEmployeesByManager = async () => {
        const employeeChoices = await getListOfCurrentEmployees();

        inquirer
        .prompt([
            {
                type: 'list',
                name: 'manager',
                message: 'Which manager\'s employees would you like to view?',
                choices: employeeChoices
            }
        ])
        .then((answers) => {
            const chosenManager = answers.manager;
            let chosenManagerID;
            for (let i = 0; i < employeeChoices.length; i++) {
                if (chosenManager == employeeChoices[i]) {
                    chosenManagerID = i + 1;
                };
            };

            const sql = `SELECT employees.id as id, employees.first_name as first_name, employees.last_name as last_name, roles.title as title FROM employees JOIN roles ON employees.role_id = roles.id WHERE manager_id = ?;`;
            const params = chosenManagerID;
            
            db.query(sql, params, (err, result) => {
                if (err) {
                    console.log(err);
                }
                
                console.table(result);
                decisionInput();
            });
        });
    }

    // View employees by department
    const viewEmployeesByDepartment = async () => {
        const departmentChoices = await getListOfCurrentDepartments();

        inquirer
        .prompt([
            {
                type: 'list',
                name: 'department',
                message: 'Which department\'s employees would you like to view?',
                choices: departmentChoices
            }
        ])
        .then((answers) => {
            const sql = `SELECT employees.id as id, employees.first_name as first_name, employees.last_name as last_name, departments.name as department FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id WHERE departments.name = ?;`;
            const params = answers.department;
            
            db.query(sql, params, (err, result) => {
                if (err) {
                    console.log(err);
                }
                
                console.table(result);
                decisionInput();
            });
        });
    }

    // View utilised budget by department
    const viewUtilisedBudgetByDepartment = async () => {
        const departmentChoices = await getListOfCurrentDepartments();

        inquirer
        .prompt([
            {
                type: 'list',
                name: 'department',
                message: 'Which department\'s utilised budget would you like to view?',
                choices: departmentChoices
            }
        ])
        .then((answers) => {
            const sql = `SELECT departments.name AS department, SUM(roles.salary) AS 'total utilised budget' FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id WHERE departments.name = ?;`;
            const params = answers.department;
            
            db.query(sql, params, (err, result) => {
                if (err) {
                    console.log(err);
                };
    
                console.table(result);
                decisionInput();
            });
        });
    }

    
    /* ===ADD-TO-DATABASE=== */

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
                };
    
                decisionInput();
            });
        });
    }
    
    // Add a role
    const addRole = async () => {        
        const departmentChoices = await getListOfCurrentDepartments();

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
                choices: departmentChoices
            }
        ])
        .then((answers) => {
            const chosenSalary = parseInt(answers.salary);
            
            const chosenDepartment = answers.department;
            let chosenDepartmentID;
            for (let i = 0; i < departmentChoices.length; i++) {
                if (chosenDepartment == departmentChoices[i]) {
                    chosenDepartmentID = i + 1;
                };
            };

            const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?)`;
            const params = [answers.title, chosenSalary, chosenDepartmentID];
            
            db.query(sql, [params], (err, result) => {
                if (err) {
                    console.log(err);
                }
    
                decisionInput();
            });
        });
    }

    // Add an employee
    const addEmployee = async () => {
        const roleChoices = await getListOfCurrentRoles();
        const managerChoices = await getListOfCurrentEmployees();
        
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
                choices: roleChoices
            },
            {
                type: 'list',
                name: 'manager',
                message: 'Who is the employee\'s manager?',
                choices: managerChoices
            }
        ])
        .then((answers) => {
            const chosenRole = answers.role;
            let chosenRoleID;
            for (let i = 0; i < roleChoices.length; i++) {
                if (chosenRole == roleChoices[i]) {
                    chosenRoleID = i + 1;
                };
            };

            const chosenManager = answers.manager;
            let chosenManagerID;
            for (let i = 0; i < managerChoices.length; i++) {
                if (chosenManager == managerChoices[i]) {
                    chosenManagerID = i + 1;
                };
            };

            const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?)`;
            const params = [answers.firstName, answers.lastName, chosenRoleID, chosenManagerID];
            
            db.query(sql, [params], (err, result) => {
                if (err) {
                    console.log(err);
                }
    
                decisionInput();
            });
        });
    }


    /* ===DELETE-FROM-DATABASE=== */

    // Delete a department
    const deleteDepartment = async () => {        
        const departmentChoices = await getListOfCurrentDepartments();

        inquirer
        .prompt([
            {
                type: 'list',
                name: 'department',
                message: 'What is the name of the department?',
                choices: departmentChoices
            }
        ])
        .then((answers) => {
            const sql = `DELETE FROM departments WHERE departments.name = ?`;
            const params = answers.department;
            
            db.query(sql, params, (err, result) => {
                if (err) {
                    console.log(err);
                }
    
                decisionInput();
            });
        });
    }

    // Delete a role
    const deleteRole = async () => {        
        const roleChoices = await getListOfCurrentRoles();

        inquirer
        .prompt([
            {
                type: 'list',
                name: 'role',
                message: 'What is the name of the role?',
                choices: roleChoices
            }
        ])
        .then((answers) => {
            const sql = `DELETE FROM roles WHERE roles.title = ?`;
            const params = answers.role;
            
            db.query(sql, params, (err, result) => {
                if (err) {
                    console.log(err);
                }
    
                decisionInput();
            });
        });
    }

    // Delete an employee
    const deleteEmployee = async () => {        
        const employeeChoices = await getListOfCurrentEmployees();

        inquirer
        .prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'What is the name of the employee?',
                choices: employeeChoices
            }
        ])
        .then((answers) => {
            const chosenEmployee = answers.employee;
            let chosenEmployeeID;
            for (let i = 0; i < employeeChoices.length; i++) {
                if (chosenEmployee == employeeChoices[i]) {
                    chosenEmployeeID = i + 1;
                };
            };
            
            const sql = `DELETE FROM employees WHERE employees.id = ?`;
            const params = chosenEmployeeID;
            
            db.query(sql, params, (err, result) => {
                if (err) {
                    console.log(err);
                }
    
                decisionInput();
            });
        });
    }


    /* ===UPDATE-DATABASE=== */

    // Change an employee's role
    const updateEmployeeRole = async () => {
        const employeeChoices = await getListOfCurrentEmployees();
        const roleChoices = await getListOfCurrentRoles();

        inquirer
        .prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Which employee\'s role do you want to update?',
                choices: employeeChoices
            },
            {
                type: 'list',
                name: 'role',
                message: 'Which role do you want to assign to the selected employee?',
                choices: roleChoices
            }
        ])
        .then((answers) => {
            const chosenRole = answers.role;
            let chosenRoleID;
            for (let i = 0; i < roleChoices.length; i++) {
                if (chosenRole == roleChoices[i]) {
                    chosenRoleID = i + 1;
                };
            };

            const sql = `UPDATE employees SET role_id = ? WHERE CONCAT(first_name, ' ', last_name) = ?`;
            const params = [chosenRoleID, answers.employee];
            
            db.query(sql, params, (err, result) => {
                if (err) {
                    console.log(err);
                }
    
                decisionInput();
            });
        });
    }

    // Change an employee's manager
    const updateEmployeeManager = async () => {
        const employeeChoices = await getListOfCurrentEmployees();

        inquirer
        .prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Which employee\'s manager do you want to update?',
                choices: employeeChoices
            },
            {
                type: 'list',
                name: 'manager',
                message: 'Which manager do you want to assign to the selected employee?',
                choices: employeeChoices
            }
        ])
        .then((answers) => {
            
            const chosenManager = answers.manager;
            let chosenManagerID;
            for (let i = 0; i < employeeChoices.length; i++) {
                if (chosenManager == employeeChoices[i]) {
                    chosenManagerID = i + 1;
                };
            };

            const sql = `UPDATE employees SET manager_id = ? WHERE CONCAT(first_name, ' ', last_name) = ?`;
            const params = [chosenManagerID, answers.employee];
            
            db.query(sql, params, (err, result) => {
                if (err) {
                    console.log(err);
                }
    
                decisionInput();
            });
        });
    }


    /* ===USER-DECISION=== */

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
                            'View employees by manager',
                            'View employees by department',
                            'View utilised budget by department',
                            'Add a department',
                            'Add a role',
                            'Add an employee',
                            'Delete a department',
                            'Delete a role',
                            'Delete an employee',
                            'Update an employee\'s role',
                            'Update an employee\'s manager',
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
            } else if (answers.decision === 'View employees by manager') {
                viewEmployeesByManager();
            } else if (answers.decision === 'View employees by department') {
                viewEmployeesByDepartment();
            } else if (answers.decision === 'View utilised budget by department') {
                viewUtilisedBudgetByDepartment();
            } else if (answers.decision === 'Add a department') {
                addDepartment();
            } else if (answers.decision === 'Add a role') {
                addRole();
            } else if (answers.decision === 'Add an employee') {
                addEmployee();
            } else if (answers.decision === 'Delete a department') {
                deleteDepartment();
            } else if (answers.decision === 'Delete a role') {
                deleteRole();
            } else if (answers.decision === 'Delete an employee') {
                deleteEmployee();
            } else if (answers.decision === 'Update an employee\'s role') {
                updateEmployeeRole();
            } else if (answers.decision === 'Update an employee\'s manager') {
                updateEmployeeManager();
            } else {
                console.log('Thanks for using the employee tracker, bye!');
                return init()
            }
        });
    }

    decisionInput();
}


/* ===HELPER-FUNCTIONS=== */

// Getting list of current departments
const getListOfCurrentDepartments = async () => {  
    const data = await db.promise().query(`SELECT name FROM departments;`);
    const departmentsObject = data[0];

    const departmentChoices = [];

    for (let i = 0; i < departmentsObject.length; i++) {
        departmentChoices.push(departmentsObject[i].name);
    };

    return departmentChoices;
};

// Getting list of current roles
const getListOfCurrentRoles = async () => {
    const data = await db.promise().query(`SELECT title FROM roles;`);
    const rolesObject = data[0];

    const roleChoices = [];

    for (let i = 0; i < rolesObject.length; i++) {
        roleChoices.push(rolesObject[i].title);
    };

    return roleChoices;
}

// Getting list of current employees
const getListOfCurrentEmployees = async () => {
    const data = await db.promise().query(`SELECT CONCAT(first_name, ' ', last_name) AS full_name FROM employees;`);
    const employeesObject = data[0];

    const employeeChoices = [];

    for (let i = 0; i < employeesObject.length; i++) {
        employeeChoices.push(employeesObject[i].full_name);
    };

    return employeeChoices;
}


/* ===INITIALISATION=== */

// Initialise app
const init = () => {
    welcome();
    respondToUserInputs();
}

init();