
/*
  ##### Global database seeding #####
  Run the following command after all tables were created:
  'yarn seed global'
*/

/* Insert user roles */
INSERT INTO user_role (name)
VALUES	('Admin'),
				('User');

/* Insert admin account */
INSERT INTO user (email, firstname, lastname, password, userRoleId)
VALUES	('admin@email.com', 'Admin', 'Admin', ?, 1);
