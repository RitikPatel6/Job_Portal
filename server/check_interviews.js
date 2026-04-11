const mysql = require('mysql');
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "job_portal",
  port: 3310,
});
db.connect();
db.query("SELECT * FROM interview LIMIT 5", (err, result) => {
  console.log("Interviews sample:", result);
  db.end();
});
