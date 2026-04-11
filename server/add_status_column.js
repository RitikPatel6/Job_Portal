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
    const sql = "ALTER TABLE job_seeker ADD COLUMN status INT DEFAULT 1"; // 1 = Active, 0 = Blocked
    db.query(sql, (err, result) => {
      if (err) {
        console.log("ALTER ERROR:", err);
      } else {
        console.log("Status column added successfully");
      }
      db.end();
    });
  }
});
