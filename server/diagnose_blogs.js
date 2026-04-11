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

    con.query("DESCRIBE blogs", (err, result) => {
        if (err) {
            console.error("Error describing blogs table:", err);
        } else {
            console.log("Blogs Table Schema:", result);
        }

        con.query("SELECT * FROM blogs", (err, result) => {
            if (err) {
                console.error("Error selecting blogs:", err);
            } else {
                console.log("Blogs Content:", result);
            }
            con.end();
        });
    });
});
