const inquirer = require('inquirer');
const Department = require('./lib/Department');
const Role = require('./lib/Role');
const Employee = require('./lib/Employee');

// Questions user is asked in CLI
const welcome = () => {
    console.log(`

Welcome to the employee tracker! 👋`);
}

const respondToUserInputs = () => {
    
    decisionInput();
    
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
            const createDepartment = new Department(answers.name);
            const department = {
                name: createDepartment.getName()
            };
            // need to add new department to database
            decisionInput();
        });
    }
    
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
            const createRole = new Role(answers.title, parseInt(answers.salary), answers.department);
            const role = {
                title: createRole.getTitle(),
                salary: createRole.getSalary(),
                department: createRole.getDepartment()
            };
            // need to add new role to database
            decisionInput();
        });
    }

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
            const createEmployee = new Employee(answers.firstName, answers.lastName, answers.role, answers.manager);
            const employee = {
                firstName: createEmployee.getFirstName(),
                lastName: createEmployee.getLastName(),
                role: createEmployee.getRole(),
                manager: createEmployee.getManager()
            };
            // need to add new employee to database
            decisionInput();
        });
    }

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

    const decisionInput = () => {
        inquirer
        .prompt([
            {
                type: 'list',
                name: 'decision',
                message: 'What would you like to do?',
                choices: ['View all departments','View all roles','View all employees','Add a department','Add a role','Add an employee','Update an employee\'s role','Quit'],
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
}

// Initialise app
const init = () => {
    welcome();
    respondToUserInputs();
}

init();