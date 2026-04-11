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
    // default type is 'chat'
    const sql = "ALTER TABLE messages ADD COLUMN type VARCHAR(50) DEFAULT 'chat'";
    db.query(sql, (err, result) => {
      if (err) {
        console.log("ALTER TABLE ERROR (might already exist):", err.message);
      } else {
        console.log("Column 'type' added to messages table");
      }
      db.end();
    });
  }
});
