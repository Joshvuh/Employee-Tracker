const mysql = require('mysql2');
const inquirer = require('inquirer');
require('console.table');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '2x@jN^M$GW7Awko2gpBK',
        database: 'employees_db'
    }
);

db.connect(function(err) {
    if (err) throw err;
    console.log('Connected to Employees Database')
    mainPrompt();
});

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

const viewAllDepartments = () => {
    db.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        console.table(res);
        mainPrompt();
    })
}

const viewAllRoles = () => {
    db.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;
        console.table(res);
        mainPrompt();
    })
}

const viewAllEmployees = () => {
    db.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        console.table(res);
        mainPrompt();
    })
}

const addDepartment = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'addDepartment',
                message: `What is the name of the department you'd like to add?`
            }
        ]).then(answer => {
            db.query('INSERT INTO department (name) VALUES (?)', answer.addDepartment, (err, res) => {
                if (err) throw err;
                db.query('SELECT * FROM department', (err, res) => {
                    if (err) throw err;
                    console.table(res);
                    mainPrompt();
                })
            })
        })
}

const addRole = () => {
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
                db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [answer.roleTitle, answer.roleSalary, answer.roleDept])
                console.log('New role has been added!')
                mainPrompt();
            });
        });
};


const addEmployee = () => {
    db.query('SELECT * FROM role', (err, roleRes) => {
        if (err) throw err;
        roleRes = roleRes.map((role) => {
            return {
                name: role.title,
                value: role.id
            };
        });
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
                message: 'What is the role of the new employee',
                choices: roleRes
            }
        ]).then((answer) => {
                db.query('INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)', [answer.addEmployeeFirst, answer.addEmployeeLast, answer.employeeRole]);
                console.log('Employee added!')
                mainPrompt();
            });
        });
};

const updateEmployee = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'addDepartment',
                message: `What is the name of the department you'd like to add?`
            }
        ]).then(answer => {
            db.query('INSERT INTO department (name) VALUES (?)', answer.addDepartment, (err, res) => {
                if (err) throw err;
                db.query('SELECT * FROM department', (err, res) => {
                    if (err) throw err;
                    console.table(res);
                    mainPrompt();
                })
            })
        })
}