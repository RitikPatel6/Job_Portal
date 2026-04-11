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
    // 1. Find users with 'afb'
    db.query("SELECT id, Name, Skills FROM job_seeker WHERE Skills LIKE '%afb%'", (err, users) => {
        console.log("USERS WITH afb:", JSON.stringify(users, null, 2));
        
        // 2. Find jobs with 'afb'
        db.query("SELECT Job_id, Job_title, skill FROM job WHERE skill LIKE '%afb%'", (err, jobs) => {
            console.log("JOBS WITH afb:", JSON.stringify(jobs, null, 2));
            db.end();
        });
    });
  }
});
