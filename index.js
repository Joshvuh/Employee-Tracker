const mysql = require('mysql2');
const inquirer = require('inquirer');
require('console.table');

// Creating DB connection
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'employees_db'
    }
);

// Connecting to DB
db.connect(function(err) {
    if (err) throw err;
    console.log('Connected to Employees Database')
    mainPrompt();
});

// Main function to prompt user with Inquirer questions
const mainPrompt = () => {
    inquirer
        .prompt([
        {
            type: 'list',
            name: 'mainMenu',
            message: 'What would you like to do?',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', `Update an employee's role`, 'Exit']
        },
    ]).then(answer => {
        switch(answer.mainMenu) {
            case 'View all departments': 
                viewAllDepartments();
                break;
            case 'View all roles': 
                viewAllRoles();
                break;
            case 'View all employees':
                viewAllEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case `Update an employee's role`:
                updateEmployee();
                break;
            case 'Exit':
                console.log('Goodbye!')
                process.exit();
        }
    })
}

// Function to view all departments
const viewAllDepartments = () => {
    db.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        console.table(res);
        mainPrompt();
    })
}

// Function to view all roles
const viewAllRoles = () => {
    db.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;
        console.table(res);
        mainPrompt();
    })
}

// Function to view all employees
const viewAllEmployees = () => {
    db.query(`SELECT e.id, e.first_name AS "First Name", e.last_name AS "Last Name", r.title, d.name AS "Department", r.salary AS "Salary", CONCAT(m.first_name," ",m.last_name) AS "Manager"
    FROM employee e LEFT JOIN role r ON r.id = e.role_id LEFT JOIN department d ON d.id = r.department_id
    LEFT JOIN employee m ON m.id = e.manager_id ORDER BY e.id;`, (err, res) => {
        if (err) throw err;
        console.table(res);
        mainPrompt();
    })
}

// Function to add a department to the db
const addDepartment = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'addDepartment',
                message: `What is the name of the department you'd like to add?`
            }
        ]).then(answer => {
            db.query('INSERT INTO department (name) VALUES (?)', answer.addDepartment.trim(), (err, res) => {
                if (err) throw err;
                db.query('SELECT * FROM department', (err, res) => {
                    if (err) throw err;
                    console.table(res);
                    mainPrompt();
                })
            })
        })
}

// Function to add a role to the db
const addRole = () => {
    // First we query the db for each department, so we can assign the role we create to a department
    db.query('SELECT * FROM department', (err, deptRes) => {
        if (err) throw err;
        deptRes = deptRes.map((department) => {
            return {
                name: department.name,
                value: department.id
            };
        });
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'roleTitle',
                    message: `What is the name of the role you'd like to add?`
                },
                {
                    type: 'input',
                    name: 'roleSalary',
                    message: `What is the base salary of this role?`
                },
                {
                    type: 'list',
                    name: 'roleDept',
                    message: `What department is the role part of?`,
                    choices: deptRes 
                },
            ]).then((answer) => {
                db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [answer.roleTitle.trim(), answer.roleSalary.trim(), answer.roleDept])
                console.log('New role has been added!')
                mainPrompt();
            });
        });
};

// Function to add an employee to the db
const addEmployee = () => {
    // Querying db for employees we can select the new employee's manager
    db.query('SELECT * FROM employee', (err, employeeRes) => {
        if (err) throw err;
        employeeRes = employeeRes.map((employee) => {
            return {
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id
            }
        })
    // Querying the db for roles so we can select the new eployee's role
    db.query('SELECT * FROM role', (err, roleRes) => {
        if (err) throw err;
        roleRes = roleRes.map((role) => {
            return {
                name: role.title,
                value: role.id
            };
        })
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'addEmployeeFirst',
                message: `What is the first name of the employee you'd like to add?`
            },
            {
                type: 'input',
                name: 'addEmployeeLast',
                message: `What is the last name of the employee you'd like to add?`
            },
            {
                type: 'list',
                name: 'employeeRole',
                message: 'What is the role of the new employee?',
                choices: roleRes
            },
            {
                type: 'list',
                name: 'employeeManager',
                message: 'Who is the manager of the new employee?',
                choices: employeeRes
            }
        ]).then((answer) => {
                db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [answer.addEmployeeFirst.trim(), answer.addEmployeeLast.trim(), answer.employeeRole, answer.employeeManager], (err, res) => {
                    if (err) throw err;
                    console.log('Employee added!')
                    mainPrompt();
                });
            });
        });
})}

// Function to update an employee's role
const updateEmployee = () => {
        db.query('SELECT * FROM employee', (err, employeeRes) => {
            if (err) throw err;
            employeeRes = employeeRes.map((employee) => {
                return {
                    name: `${employee.first_name} ${employee.last_name}`,
                    value: employee.id
                }
            })
        db.query('SELECT * FROM role', (err, roleRes) => {
            if (err) throw err;
            roleRes = roleRes.map((role) => {
                return {
                    name: role.title,
                    value: role.id
                };
            })
        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'employeeChoice',
                    message: `What is the name of the employee you'd like to update?`,
                    choices: employeeRes
                },
                {
                    type: 'list',
                    name: 'employeeRole',
                    message: `What is the employee's new role?`,
                    choices: roleRes
                }
            ]).then((answer) => {
                    db.query(`UPDATE employee SET role_id = ${answer.employeeRole} WHERE id = ${answer.employeeChoice}`);
                    console.log('Role updated!')
                    mainPrompt();
                });
            });
})}