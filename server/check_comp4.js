const mysql = require('mysql');
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "job_portal",
  port: 3310,
});
db.connect();
db.query("SELECT * FROM interview WHERE companyId=4", (err, result) => {
  console.log("Interviews for company 4:", result);
  db.end();
});
