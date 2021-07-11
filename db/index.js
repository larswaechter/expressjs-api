const mysql = require('mysql');
const fs = require('fs');
const bcrypt = require('bcryptjs');

// Read SQL seed query
seedQuery = fs.readFileSync('db/seed.sql', {
	encoding: 'utf-8'
});

// Read MySQL config
const config = JSON.parse(
	fs.readFileSync('ormconfig.json', {
		encoding: 'utf-8'
	})
);

// Connect to database
const connection = mysql.createConnection({
	host: config.host,
	user: config.username,
	password: config.password,
	database: config.database,
	multipleStatements: true
});

connection.connect();

// Generate random password for initial admin user
const psw = Math.random().toString(36).substring(7);
const hash = bcrypt.hashSync(psw, 10);

console.log('Running SQL seed...');

// Run seed query
connection.query(seedQuery, [hash], (err) => {
	if (err) {
		throw err;
	}

	console.log('SQL seed completed! Password for initial admin account: ' + psw);
});

connection.end();
