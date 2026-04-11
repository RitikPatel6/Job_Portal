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
    const msg = {
      sender: "TestCompany",
      email: "test@user.com",
      subject: "Test Subject",
      message: "Test Message",
      company: "TestCompany",
      job: "Tester"
    };

    const sql = "INSERT INTO messages (sender, email, subject, message, company, job, reply) VALUES (?, ?, ?, ?, ?, ?, '')";
    db.query(sql, [msg.sender, msg.email, msg.subject, msg.message, msg.company, msg.job], (err, result) => {
      if (err) {
        console.log("INSERT ERROR:", err.message);
      } else {
        console.log("Insert successful, ID:", result.insertId);
        
        db.query("SELECT * FROM messages WHERE id = ?", [result.insertId], (err, rows) => {
          console.log("Fetched after insert:", rows);
          db.end();
        });
      }
    });
  }
});
