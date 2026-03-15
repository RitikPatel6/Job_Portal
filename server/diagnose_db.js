const mysql = require('mysql');

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "job_portal",
    port: 3310
});

con.connect((err) => {
    if (err) {
        console.error("Database connection error:", err);
        process.exit(1);
    }
    console.log("Connected to MySQL database");

    // Check tables
    con.query("SHOW TABLES", (err, tables) => {
        if (err) {
            console.error("Error showing tables:", err);
            process.exit(1);
        }
        console.log("Tables:", tables);

        // Describe job table
        con.query("DESCRIBE job", (err, result) => {
            if (err) {
                console.error("Error describing job table:", err);
            } else {
                console.log("Job Table Schema:", result);
            }

            // Describe job_category table
            con.query("DESCRIBE job_category", (err, result) => {
                if (err) {
                    console.error("Error describing job_category table:", err);
                } else {
                    console.log("Job Category Table Schema:", result);
                }

                // Select all from job_category to see IDs
                con.query("SELECT * FROM job_category", (err, result) => {
                    if (err) {
                        console.error("Error selecting job_category:", err);
                    } else {
                        console.log("Job Categories:", result);
                    }
                    con.end();
                });
            });
        });
    });
});
