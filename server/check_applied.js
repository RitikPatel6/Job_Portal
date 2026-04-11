const mysql = require('mysql');
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "job_portal",
  port: 3310,
});
db.connect();
db.query("SELECT * FROM applied WHERE id=29", (err, result) => {
  console.log("Applied with id 29:", result);
  db.end();
});
