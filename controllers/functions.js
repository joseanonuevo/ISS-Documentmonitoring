const db = require("../db/connectDB");

exports.deleterow = (req, res) => {
  const id = req.body;
  const sql = "DELETE FROM files WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (!err) return res.send("deleted");
    else return res.send(err);
  });
};
