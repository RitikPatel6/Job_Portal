const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "job_portal",
  port: 3310,
});

db.connect();

const skill = "C++";
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\\\$&");
const escaped = escapeRegex(skill);
const pattern = `(^|[^a-zA-Z0-9#+])C\\+\\+($|[^a-zA-Z0-9#+])`;

console.log("Testing pattern:", pattern);

const sql = "SELECT Job_title, skill FROM job WHERE skill REGEXP ?";
db.query(sql, [pattern], (err, results) => {
  if (err) console.error("SQL ERROR:", err);
  console.log("Results:", JSON.stringify(results, null, 2));
  db.end();
});
