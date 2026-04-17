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
    // 1. Check a few jobs
    db.query("SELECT Job_id, Job_title, skill FROM job LIMIT 5", (err, jobs) => {
        console.log("SAMPLE JOBS:", JSON.stringify(jobs, null, 2));
        
        // 2. Check a few users
        db.query("SELECT id, Name, Skills FROM job_seeker LIMIT 5", (err, users) => {
            console.log("SAMPLE USERS:", JSON.stringify(users, null, 2));
            db.end();
        });
    });
  }
});
