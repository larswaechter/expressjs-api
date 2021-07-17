const mysql = require('mysql2');
const fs = require('fs');
const bcrypt = require('bcryptjs');

require('dotenv').config();

// Read SQL seed query
seedQuery = fs.readFileSync('db/seed.sql', {
	encoding: 'utf-8'
});

// Connect to database
const connection = mysql.createConnection({
	host: process.env.TYPEORM_HOST,
	user: process.env.TYPEORM_USERNAME,
	password: process.env.TYPEORM_PASSWORD,
	database: process.env.TYPEORM_DATABASE,
	multipleStatements: true
});

connection.connect();

// Generate random password for initial admin user
const psw = Math.random().toString(36).substring(2);
const hash = bcrypt.hashSync(psw, 10);

console.log('Running SQL seed...');

// Run seed query
connection.query(seedQuery, [hash], (err) => {
	if (err) {
		throw err;
	}

	console.log('SQL seed completed! Password for initial admin account: ' + psw);
	connection.end();
});
