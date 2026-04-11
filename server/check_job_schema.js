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

    const tables = ['company', 'job', 'job_category', 'location'];
    let completed = 0;

    tables.forEach(table => {
        con.query(`SHOW TABLES LIKE '${table}'`, (err, res) => {
            if (res.length > 0) {
                con.query(`DESCRIBE ${table}`, (err, result) => {
                    if (err) throw err;
                    console.log(`\n--- ${table} ---`);
                    result.forEach(row => {
                        console.log(`${row.Field} (${row.Type})`);
                    });
                    
                    completed++;
                    if (completed === tables.length) process.exit(0);
                });
            } else {
                console.log(`\n--- ${table} (Not Found) ---`);
                completed++;
                if (completed === tables.length) process.exit(0);
            }
        });
    });
});
