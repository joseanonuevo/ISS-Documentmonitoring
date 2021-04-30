const mysql = require('mysql');

const db_config = {
	host: process.env.DATABASE_HOST,
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE
};

function handleDisconnect() {
	db = mysql.createConnection(db_config);
	db.connect((err) => {
		if (err) {
			setTimeout(handleDisconnect, 5000);
		}
	});
	db.on('error', (err) => {
		console.log('db error', err);
		if (err.code === 'PROTOCOL_CONNECTION_LOST') {
			handleDisconnect();
		} else {
			throw err;
		}
	});
}
handleDisconnect();

module.exports = db;
