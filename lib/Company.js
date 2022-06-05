/* This is importing the inquirer, db, and console.table packages. */
const inquirer = require("inquirer");
const db = require("../db/connection");
const cTable = require("console.table");

/* A Company has division, roles, and employees. */
class Company {
  constructor() {
    this.division = [];
    this.roles = [];
    this.employees = [];
  }
}

/* This is a function that is used to seed the database. */
Company.prototype.seedDatabase = async function () {
  const selectdivision = await db
    .promise()
    .query(`SELECT * FROM division`)
    .then((res) => {
      this.division = res[0];
    });

  const selectRoles = await db
    .promise()
    .query(`SELECT * FROM role`)
    .then((res) => {
      this.roles = res[0];
    });

  const getEmployees = await db
    .promise()
    .query(`SELECT * FROM employee`)
    .then((res) => {
      this.employees = res[0];
    });
};

/* This is a function that is used to show the division table. */
Company.prototype.showdivision = async function () {
  console.clear();
  const findTable = await db
    .promise()
    .query(`SELECT * FROM division`)
    .then(([rows, fields]) => {
      console.table(rows);
    });
};

/* This is a function that is used to show the roles table. */
Company.prototype.showRoles = async function () {
  console.clear();
  const findTable = await db
    .promise()
    .query(
      `SELECT role.id, role.title, role.salary, division.name
            AS division
            FROM role
            LEFT JOIN division
            ON role.division_id = division.id`
    )
    .then(([rows, fields]) => {
      console.table(rows);
    });
};

/* This is a function that is used to show the employees table. */
Company.prototype.showEmployees = async function () {
  console.clear();
  const findTable = await db
    .promise()
    .query(
      `SELECT e.id,
        e.first_name,
        e.last_name,
        role.title AS job_title,
        division.name AS division,
        role.salary AS salary,
        CONCAT(m.first_name, ' ', m.last_name) AS manager
        FROM employee e
        INNER JOIN role ON e.role_id = role.id
        INNER JOIN division ON role.division_id = division.id
        LEFT JOIN employee m ON m.id = e.manager_id
        ORDER BY id`
    )
    .then(([rows, fields]) => {
      console.table(rows);
    });
};

/* This is a function that is used to add a division to the database. */
Company.prototype.adddivision = async function () {
  const division = this.division.map((division) => {
    return division.name;
  });

  /* This is a function that is used to add a division to the database. */
  const prompt = await inquirer
    .prompt([
      {
        type: "input",
        name: "division",
        message: "What is the division name?",
        validate: (input) => {
          if (input === "") {
            return "Enter division name.";
          } else if (division.includes(input)) {
            return "Division already exists.";
          }
          return true;
        },
      },
    ])
    .then((data) => {
      db.query(`INSERT INTO division (name) VALUES ('${data.division}')`);
      return data;
    })
    .then((data) => {
      this.seedDatabase();
      const msg = `${data.division} division added.`;
      this.menu(msg);
    });
};

/* This is a function that is used to add a role to the database. */
Company.prototype.addRole = async function () {
  const division = this.division.map((division) => {
    return division.name;
  });
  const divisionId = this.division.map((division) => {
    return division.id;
  });

  /* The above code is using inquirer to prompt the user for information about a new role. The user
    is prompted for the role name, salary, and division. The division is a list of division
    that the user can choose from. The data is then inserted into the database. */
  const prompt = await inquirer
    .prompt([
      {
        type: "input",
        name: "role",
        message: "Please enter name of role?",
      },
      {
        type: "number",
        name: "salary",
        message: "Please enter role salary",
      },
      {
        type: "list",
        name: "division",
        message: "What division is this role for?",
        choices: division,
      },
    ])
    .then(async (data) => {
      await db
        .promise()
        .query(
          `INSERT INTO role (title, salary, division_id) VALUES ('${
            data.role
          }', ${data.salary}, ${
            divisionId[division.indexOf(data.division)]
          })`
        );
      return data;
    })
    .then((data) => {
      this.seedDatabase();
      const msg = `${data.role} role added.`;
      this.menu(msg);
    });
};

/* This is a function that is used to add an employee to the database. */
Company.prototype.addEmployee = async function () {
  const roles = this.roles.map((role) => {
    return role.title;
  });
  const rolesId = this.roles.map((role) => {
    return role.id;
  });
  const manager = this.employees.map((employee) => {
    return `${employee.first_name} ${employee.last_name}`;
  });
  const managerId = this.employees.map((employee) => {
    return employee.id;
  });

  /* The above code is using the inquirer npm package to prompt the user for information about the
    employee they want to add. The inquirer package is a collection of common interactive command
    line user interfaces. The inquirer package is used to prompt the user for information about the
    employee they want to add. The inquirer package is used to prompt the user for information about
    the employee they want to add. The inquirer package is used to prompt the user for information
    about the employee they want to add. The inquirer package is used to prompt the user for
    information about the employee they want to add. The */
  const prompt = await inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "First Name of employer?",
      },
      {
        type: "input",
        name: "last_name",
        message: "Last name of the employee?",
      },
      {
        type: "list",
        name: "manager",
        message: "Who is the employess manager?",
        choices: manager,
      },
      {
        type: "list",
        name: "role",
        message: "What role is the employee for?",
        choices: roles,
      },  
    ])
    .then(async (data) => {
      await db
        .promise()
        .query(
          `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${
            data.first_name
          }', '${data.last_name}', ${rolesId[roles.indexOf(data.role)]}, ${
            managerId[manager.indexOf(data.manager)]
          })`
        );
      return data;
    })
    .then((data) => {
      this.seedDatabase();
      const msg = `${data.first_name} ${data.last_name} added.`;
      this.menu(msg);
    });
};

/* This is a function that is used to remove a division from the database. */
Company.prototype.updateEmployeeRole = async function () {
  const employees = this.employees.map((employee) => {
    return `${employee.first_name} ${employee.last_name}`;
  });
  const employeesId = this.employees.map((employee) => {
    return employee.id;
  });
  const roles = this.roles.map((role) => {
    return role.title;
  });
  const rolesId = this.roles.map((role) => {
    return role.id;
  });

  const prompt = await inquirer
    .prompt([
      {
        type: "list",
        name: "employee",
        message: "What user/employee would you like to update?",
        choices: employees,
      },
      {
        type: "list",
        name: "role",
        message: "What new role would you like to assign?",
        choices: roles,
      },
    ])
    .then(async (data) => {
      await db
        .promise()
        .query(
          `UPDATE employee SET role_id = ${
            rolesId[roles.indexOf(data.role)]
          } WHERE id = ${employeesId[employees.indexOf(data.employee)]}`
        );
      return data;
    })
    .then((data) => {
      this.seedDatabase();
      const msg = `${data.employee}'s role updated.`;
      this.menu(msg);
    });
};

/* This is a function that is called after the user has viewed the table. It gives the user the option
to return to the menu, add to the table, or exit the program. */
Company.prototype.postOptions = function (table) {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "What do you want to do next?",
        choices: ["Return to Menu", `Add ${table}`, "Exit"],
      },
    ])
    .then((menu) => {
      switch (menu.choice) {
        case "Return to Menu":
          this.menu();
          break;
        case `Add ${table}`:
          if (table === "division") {
            this.adddivision();
          } else if (table === "Role") {
            this.addRole();
          } else if (table === "Employee") {
            this.addEmployee();
          }
          break;
        case "Exit":
          process.exit();
      }
    });
};

/* The above code is creating a new object called Company. It is also creating a new method called
exitProgram. */
Company.prototype.exitProgram = function () {
  console.log("Bye for now!");
  process.exit();
};

/* The above code is a function that is called when the user selects the option to view the menu. The
function is called menu and it takes in a message as a parameter. The function then clears the
console and if there is a message, it will log the message. The function then uses inquirer to
prompt the user with a list of options. The user can select one of the options and the function will
then run the appropriate function based on the user's selection. */
Company.prototype.menu = async function (msg) {
  console.clear();
  if (msg) {
    console.log(msg);
  }

  const prompt = await inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "Choose your next option",
        choices: [
          "Add division",
          "Add role",
          "Add employee",
          "View all employees",
          "View all roles",
          "View all division",
          "Update employee role",
          "Exit",
        ],
      },
    ])
    .then((menu) => {
      switch (menu.choice) {
        case "Add division":
          this.adddivision();
          break;
        case "Add role":
          this.addRole();
          break;
        case "Add employee":
          this.addEmployee();
          break;
        case "View all employees":
          this.showEmployees().then(() => {
            this.postOptions("Employee");
          });
          break;
        case "View all roles":
          this.showRoles().then(() => {
            this.postOptions("Role");
          });
          break;
        case "View all division":
          this.showdivision().then(() => {
            this.postOptions("division");
          });
          break;
        case "Update employee role":
          this.updateEmployeeRole();
          break;
        case "Exit":
          this.exitProgram();
      }
    });
};

/*  */
module.exports = Company;
