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
    db.query("SHOW TABLES", (err, result) => {
      if (err) {
        console.log("SHOW TABLES ERROR:", err);
      } else {
        console.log("Tables list:", result);
      }
      db.end();
    });
  }
});
