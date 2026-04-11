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
    db.query("DESCRIBE messages", (err, result) => {
      if (err) {
        console.log("DESCRIBE messages ERROR:", err);
      } else {
        console.log("Messages table schema:", result);
      }
      db.end();
    });
  }
});
