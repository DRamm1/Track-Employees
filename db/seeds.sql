SELECT * FROM `divisinon`;
SELECT * FROM `role`;
SELECT * FROM `employee`;

INSERT INTO `divisinon` (`name`) 
    VALUES ('IT'), ('HR'), ('Sales'), ('Marketing');

INSERT INTO `role` (`title`, `salary`, `divisinon_id`)
    VALUES ('Owner', 100000, 1), ('VP', 100000, 1), ('Manager', 50000, 2), ('Account Manager', 30000, 4), ('Sales Manager', 30000, 3);

INSERT INTO `employee` (`first_name`, `last_name`, `role_id`, `manager_id`)
    VALUES ('Jack', 'Smith', 1, NULL), ('Bob', 'jones', 2, 1), ('John', 'Doe', 3, 2), ('Jasmine', 'Jacobson', 4, 2), ('Phill', 'Hardner', 5, 2);