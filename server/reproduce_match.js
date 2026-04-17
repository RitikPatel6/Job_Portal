const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "job_portal",
  port: 3310,
});

db.connect();

const userSkills = "C, C++, Java, Python), Web development (HTML, CSS, JavaScript), Database management (MySQL, MongoDB), ";
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\\\$&");

const processedSkills = userSkills
  .replace(/[()""“”'']/g, ",")
  .split(/[,\n.]/)
  .map(s => s.trim())
  .filter(s => s.length > 0);

const keywords = [];
processedSkills.forEach(phrase => {
  const words = phrase.split(/\s+/)
    .map(w => w.replace(/[^a-zA-Z0-9#+]/g, "").trim())
    .filter(w => w.length > 3);
  if (words.length > 1) {
    words.forEach(word => {
      if (word && !keywords.includes(word) && !processedSkills.includes(word)) {
        keywords.push(word);
      }
    });
  }
});

const scoreParts = [];
const searchTerms = [];

processedSkills.forEach((phrase) => {
  const cleanPhrase = phrase.replace(/^[^a-zA-Z0-9#+]+|[^a-zA-Z0-9#+]+$/g, "");
  if (cleanPhrase) {
    scoreParts.push("(CASE WHEN skill REGEXP ? THEN 50 ELSE 0 END)");
    const escaped = escapeRegex(cleanPhrase);
    searchTerms.push(`(^|[^a-zA-Z0-9#+])${escaped}($|[^a-zA-Z0-9#+])`);
  }
});

keywords.forEach((word) => {
  scoreParts.push("(CASE WHEN skill REGEXP ? THEN 1 ELSE 0 END)");
  const escaped = escapeRegex(word);
  searchTerms.push(`(^|[^a-zA-Z0-9#+])${escaped}($|[^a-zA-Z0-9#+])`);
});

const sql = `SELECT Job_id, Job_title, (${scoreParts.join(" + ")}) as match_count FROM job HAVING match_count >= 100`;

console.log("SQL:", sql);
console.log("Params:", searchTerms);

db.query(sql, searchTerms, (err, results) => {
  if (err) console.error(err);
  console.log("Matches over 100:", JSON.stringify(results, null, 2));
  db.end();
});
