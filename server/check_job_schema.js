const mysql = require('mysql');

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "job_portal",
    port: 3310
});

con.connect((err) => {
    if (err) throw err;
    console.log("Connected!");
    con.query("DESCRIBE job", (err, result) => {
        if (err) throw err;
        console.log("Job Table Columns:");
        result.forEach(row => {
            console.log(`${row.Field} (${row.Type})`);
        });
        process.exit(0);
    });
});
