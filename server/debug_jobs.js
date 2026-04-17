const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "job_portal",
  port: 3310,
});

db.connect();

db.query("SELECT Job_id, Job_title, skill FROM job WHERE Job_title LIKE '%Bash%'", (err, results) => {
  if (err) console.error(err);
  console.log(JSON.stringify(results, null, 2));
  db.end();
});
