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
    // Test for a user ID (let's assume ID 6 exists)
    const userId = 6;
    const userSql = "SELECT Skills FROM job_seeker WHERE id = ?";
    db.query(userSql, [userId], (err, userResult) => {
      if (err) {
        console.log("User Fetch Error:", err);
      } else if (userResult.length === 0) {
        console.log("User not found");
      } else {
        const skills = userResult[0].Skills || "";
        console.log("User Skills:", skills);
        
        const skillsList = skills.split(",").map(s => s.trim()).filter(s => s !== "");
        if (skillsList.length === 0) {
            console.log("No skills found for user");
        } else {
            let jobSql = `SELECT j.* FROM job j WHERE (`;
            const searchTerms = [];
            skillsList.forEach((skill, index) => {
                jobSql += `j.skill LIKE ? ${index < skillsList.length - 1 ? "OR " : ""}`;
                searchTerms.push(`%${skill}%`);
            });
            jobSql += `)`;
            console.log("Query:", jobSql);
            console.log("Params:", searchTerms);
            
            db.query(jobSql, searchTerms, (err, jobResult) => {
                if (err) console.log("Job Query Error:", err);
                else console.log("Found jobs:", jobResult.length);
                db.end();
            });
            return;
        }
      }
      db.end();
    });
  }
});
