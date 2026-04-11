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
    const sql = "ALTER TABLE messages ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP";
    db.query(sql, (err, result) => {
      if (err) {
        console.log("ALTER TABLE ERROR (might already exist):", err.message);
      } else {
        console.log("Column updated_at added to messages table");
      }
      db.end();
    });
  }
});
