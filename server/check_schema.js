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
    console.error("Connection error:", err);
    process.exit(1);
  }
  console.log("Connected to MySQL");

  const tables = ["company", "job", "applied", "job_seeker"];
  let pending = tables.length;

  tables.forEach((table) => {
    db.query(`DESCRIBE ${table}`, (err, result) => {
      console.log(`\n--- TABLE: ${table} ---`);
      if (err) {
        console.error(`Error describing ${table}:`, err.message);
      } else {
        console.table(result);
      }
      if (--pending === 0) db.end();
    });
  });
});
