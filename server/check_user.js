const mysql = require('mysql');
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "job_portal",
  port: 3310,
});
db.connect();
db.query("SELECT * FROM job_seeker WHERE id=5", (err, result) => {
  console.log("Job seeker with id 5:", result);
  db.end();
});
