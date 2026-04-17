const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "job_portal",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to DB:", err);
    process.exit(1);
  }
  
  db.query("DESCRIBE company", (err, result) => {
    if (err) {
      console.error("Error describing table:", err);
    } else {
      console.log("COMPANY TABLE SCHEMA:");
      console.table(result);
    }
    db.end();
  });
});
