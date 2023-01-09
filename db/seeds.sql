INSERT INTO department (id, name)
VALUES (1, "Developers"),
       (2, "Marketing"),
       (3, "Support");

INSERT INTO role (id, title, salary, department_id)
VALUES (1, "WebDev", 80000, 1),
       (2, "Community Manager", 75000, 2),
       (3, "Customer Support", 60000, 3);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, "Josh", "Lemmond", 1, 1),
       (2, "Brandon", "Jones", 2, 1),
       (3, "Ty", "Hernandez", 3, 1),
       (4, "Preston", "Wescott", 1, 1);