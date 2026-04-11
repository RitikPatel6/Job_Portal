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
    const sql = "ALTER TABLE messages ADD COLUMN job VARCHAR(200) DEFAULT NULL";
    db.query(sql, (err, result) => {
      if (err) {
        console.log("ALTER TABLE ERROR (might already exist):", err.message);
      } else {
        console.log("Column job added to messages table");
      }
      db.end();
    });
  }
});
