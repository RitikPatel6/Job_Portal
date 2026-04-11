const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "job_portal",
  port: 3310,
});

db.connect((err) => {
  if (err) {
    console.log("Database Error:", err);
    process.exit(1);
  } else {
    console.log("Database Connected");
    db.query("DESCRIBE job_seeker", (err, result) => {
      if (err) {
        console.log("DESCRIBE ERROR:", err);
      } else {
        console.log("Job Seeker Table Schema:", result);
      }
      db.end();
    });
  }
});
