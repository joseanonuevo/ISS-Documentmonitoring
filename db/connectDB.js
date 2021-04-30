const mysql = require('mysql');

const db = mysql.createConnection({
	host: process.env.DATABASE_HOST,
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE
});
db.connect((err) => {
	if (!err) return console.log('connected to ' + process.env.DATABASE);
	else return console.log('connection error');
});

module.exports = db;
