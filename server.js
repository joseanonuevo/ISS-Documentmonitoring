const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const app = express();
const cors = require('cors');
app.use(cookieParser());

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));
app.use(cors());

//import routes
const emailService = require('./routes/emailService');
const auth = require('./routes/auth');
const routes = require('./routes/routes');
const upload = require('./routes/upload');
const functions = require('./routes/functions');

//thing used to parse
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

//middleware
app.use('/auth', auth);
app.use('/api', emailService);
app.use('/', routes);
app.use('/upload', upload);
app.use('/functions', functions);

//FUNCTIONS
const db = require('./db/connectDB');
const e = require('express');

app.delete('/delete/:id', (request, response) => {
	const { id } = request.params;
	const result = deleteRowById(id);
	result
		.then((data) =>
			response.json({
				success: true
			})
		)
		.catch((err) => console.log(err));
});

app.delete('/deleteUpdate/:id', (request, response) => {
	const { id } = request.params;
	var create_docuID = request.headers.referer;
	var new_ID = create_docuID.split('/').pop();
	const dateAdded = new Date().toLocaleString('en-US', {
		timeZone: 'Asia/Taipei'
	});
	const sql = 'SELECT MAX(updateDocu_ID) as query_ID,updateDocu_Title FROM update_document WHERE createDocu_ID = ?';
	db.query(sql, [new_ID], (err, result1) => {
		c1 = result1[0].query_ID; //query results comparison
		c2 = id; //original
		const document_name = result1[0].updateDocu_Title; //title of document update
		if (c1 > c2) {
			//insert to activity log
			const result1 = deleteRowByIdUpdate(id);
			result1
				.then((data) =>
					response.json({
						success: true
					})
				)
				.catch((err) => console.log(err));
			query2 = 'INSERT INTO activity_log (activity,date,document_name,user_ID) VALUES(?,?,?,?)';
			db.query(
				query2,
				['has deleted an update', dateAdded, document_name, request.cookies.authcookie2],
				(err, results) => {
					console.log(results);
				}
			);
		} else {
			query2 = 'INSERT INTO activity_log (activity,date,document_name,user_ID) VALUES(?,?,?,?)';
			db.query(
				query2,
				['has deleted an update', dateAdded, document_name, request.cookies.authcookie2],
				(err, results) => {
					console.log('pass');
				}
			);
			const sql1 = 'SELECT * FROM update_document WHERE createDocu_ID = ? ORDER BY updateDocu_ID DESC';
			db.query(sql1, [new_ID], (err, result) => {
				if (result.length == 1) {
					const query = 'DELETE FROM update_document WHERE updateDocu_ID = ?';
					db.query(query, [id], (err, results) => {
						console.log('passed');
					});
					const result = deleteRowById(new_ID);
					result
						.then((data) =>
							response.json({
								success: true
							})
						)
						.catch((err) => console.log(err));
				} else {
					//update create docu head
					sql2 =
						'UPDATE create_document SET createDocu_Title = ?, createDocu_Date = ?, createDocu_Description = ?, createDocu_tobeSignedby = ?, createDocu_Attachment = ?, createDocu_Status = ?, user_ID = ? WHERE createDocu_ID = ?';
					db.query(
						sql2,
						[
							result[1].updateDocu_Title,
							result[1].updateDocu_Date,
							result[1].updateDocu_Description,
							result[1].updateDocu_Signedby,
							result[1].updateDocu_Attachment,
							result[1].updateDocu_Status,
							result[1].user_ID,
							new_ID
						],
						(err, results) => {
							console.log(results);
							if (!err) {
								const result = deleteRowByIdUpdate(id);
								result.then((data) =>
									response.json({
										success: true
									})
								);
							} else {
								console.log(err);
								//console.log(err);
							}
						}
					);
				}
			});
		}
	});
});
app.patch('/archive/:id', (request, response) => {
	const { id } = request.params;

	const result = archiveRowById(id);

	result
		.then((message) => {
			const dateAdded = new Date().toLocaleString('en-US', {
				timeZone: 'Asia/Taipei'
			});
			const query1 = 'SELECT createDocu_Title FROM create_document WHERE createDocu_ID = ?';
			db.query(query1, [id], (err, results) => {
				const document_name = results[0].createDocu_Title;
				const query2 = 'INSERT INTO activity_log (activity, date, document_name, user_ID) VALUES(?, ?, ?, ?)';
				db.query(
					query2,
					['has archived', dateAdded, document_name, request.cookies.authcookie2],
					(err, results) => {
						console.log('pass');
					}
				);
			});
			response.json({
				success: true
			});
		})
		.catch((message) => {
			response.json({
				failed: true
			});
		});
});

app.patch('/disable/:email', (request, response) => {
	const { email } = request.params;
	const result = disableRowById(email);
	result.then((data) => {
		response.json({
			success: true
		});
	});
});

app.patch('/enable/:email', (request, response) => {
	const { email } = request.params;
	const result = enableRowById(email);
	result.then((data) => {
		response.json({
			success: true
		});
	});
});

async function deleteRowById(id) {
	try {
		id = parseInt(id, 10);
		const response = await new Promise((resolve, reject) => {
			const query = 'DELETE FROM create_document WHERE createDocu_ID = ?';
			db.query(query, [id], (err, results) => {
				if (err) reject(new Error(err.message));
				resolve(results);
			});
		});
		return response === 1 ? true : false;
	} catch (error) {
		console.log(error);
		return false;
	}
}

async function deleteRowByIdUpdate(id) {
	try {
		id = parseInt(id, 10);
		const response = await new Promise((resolve, reject) => {
			const query = 'DELETE FROM update_document WHERE updateDocu_ID = ?';
			db.query(query, [id], (err, results) => {
				console.log(results);
				if (err) reject(new Error(err.message));
				resolve(results);
			});
		});
		return response === 1 ? true : false;
	} catch (error) {
		console.log(error);
		return false;
	}
}

async function archiveRowById(id) {
	const dateArchived = new Date();

	const sql = 'SELECT createDocu_Status FROM create_document WHERE createDocu_ID = ?';
	const response = await new Promise((resolve, reject) => {
		db.query(sql, [id], async (err, results) => {
			const status = results[0].createDocu_Status;
			if (status == 'Complete' || status == 'Canceled') {
				id = parseInt(id, 10);
				const query = 'UPDATE create_document SET isArchive = 1 WHERE createDocu_ID = ?';
				db.query(query, [id], (err, results) => {
					resolve('Success');
				});
			} else {
				reject('Failed');
			}
		});
	});
}

async function disableRowById(email) {
	try {
		const response = await new Promise((resolve, reject) => {
			const query = 'UPDATE users SET user_Status = 0 WHERE user_Email = ?';
			db.query(query, [email], (err, results) => {
				if (err) reject(new Error(err.message));
				resolve(results);
			});
		});
		return response === 1 ? true : false;
	} catch (error) {
		console.log(error);
		return false;
	}
}

async function enableRowById(email) {
	try {
		const response = await new Promise((resolve, reject) => {
			const query = 'UPDATE users SET user_Status = 1 WHERE user_Email = ?';
			db.query(query, [email], (err, results) => {
				if (err) reject(new Error(err.message));
				resolve(results);
			});
		});
		return response === 1 ? true : false;
	} catch (error) {
		console.log(error);
		return false;
	}
}

app.get('/notify', (req, res) => {
	//console.log(req.cookies.authcookie2);
	const sql = 'SELECT user_ID  FROM users where viewed = 0';
	db.query(sql, (err, results) => {
		res.json({
			message: results
		});
	});
});

app.get('/updatenotif', (req, res) => {
	const sql = 'UPDATE users SET viewed = 1 WHERE user_ID = ?';

	db.query(sql, [req.cookies.authcookie2], (err, results) => {
		if (err) {
			console.log(err);
		} else {
			console.log(results);
		}
	});
});

app.set('trust proxy', 'loopback, 123.123.123.123'); // specify a subnet and an address
const SERVER = 3000 || process.env.PORT;
app.listen(SERVER, () => {
	console.log('Server @ ' + SERVER);
});
