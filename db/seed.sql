
/*
  ##### Database seeding #####
  Run the following command after all tables were created:
  'npm run seed'
*/

/* Insert user roles */
INSERT INTO user_role (name)
VALUES	('Admin'),
				('User');

SET @admin_role_id = (SELECT id FROM user_role WHERE name = 'Admin');

/* Insert admin account */
INSERT INTO user (email, firstname, lastname, password, userRoleId)
VALUES	('admin@email.com', 'Admin', 'Admin', ?, @admin_role_id);
