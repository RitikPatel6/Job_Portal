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
    const sql = `
    SELECT
      (SELECT COUNT(*) FROM company) AS totalCompanies,
      (SELECT COUNT(*) FROM job) AS totalJobs,
      (SELECT COUNT(*) FROM applied) AS totalApplications,
      (SELECT COUNT(*) FROM interview) AS totalInterviews
    `;
    db.query(sql, (err, result) => {
      if (err) {
        console.log("QUERY ERROR:", err.sqlMessage || err);
      } else {
        console.log("Query success:", result[0]);
      }
      db.end();
    });
  }
});
