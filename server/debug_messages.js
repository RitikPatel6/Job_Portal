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
    const sql = "SELECT * FROM messages ORDER BY id DESC LIMIT 5";
    db.query(sql, (err, result) => {
      if (err) {
        console.log("QUERY ERROR:", err.message);
      } else {
        console.log("Last 5 messages:", JSON.stringify(result, null, 2));
      }
      db.end();
    });
  }
});
