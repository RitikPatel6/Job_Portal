const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* ================= DATABASE ================= */

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
  } else {
    console.log("Database Connected");
  }
});

/* ================= MULTER ================= */

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* ================================================= */
/* ================= CATEGORY APIs ================= */
/* ================================================= */

// Get Categories
app.get("/api/jobcategories", (req, res) => {

  const sql = "SELECT * FROM job_category ORDER BY Jobcat_id DESC";

  db.query(sql, (err, data) => {
    if (err) {
      return res.status(500).send(err);
    }

    res.send(data);
  });

});

// Add Category
app.post("/api/jobcategories", (req, res) => {

  const { Jobcat_name, Jobcat_description } = req.body;

  const sql =
    "INSERT INTO job_category (Jobcat_name, Jobcat_description) VALUES (?,?)";

  db.query(sql, [Jobcat_name, Jobcat_description], (err) => {

    if (err) {
      return res.status(500).send(err);
    }

    res.send({
      success: true,
      message: "Category Added Successfully",
    });

  });

});

// Delete Category
app.delete("/api/deletejobcategory/:id", (req, res) => {

  const sql = "DELETE FROM job_category WHERE Jobcat_id=?";

  db.query(sql, [req.params.id], (err) => {

    if (err) {
      return res.status(500).send(err);
    }

    res.send({
      success: true,
      message: "Category Deleted Successfully",
    });

  });

});
// Get Category By ID (Edit Page)
app.post("/api/editcategory", (req, res) => {

  const { Jobcat_id } = req.body;

  const sql = "SELECT * FROM job_category WHERE Jobcat_id=?";

  db.query(sql, [Jobcat_id], (err, result) => {

    if (err) {
      return res.status(500).send(err);
    }

    if (result.length === 0) {
      return res.send(null);
    }

    res.send(result[0]);

  });

});
/* ================= UPDATE CATEGORY ================= */
app.put("/api/updatecategory", (req, res) => {

  const { Jobcat_id, Jobcat_name, Jobcat_description } = req.body;

  const sql = `
  UPDATE job_category
  SET Jobcat_name=?, Jobcat_description=?
  WHERE Jobcat_id=?`;

  db.query(sql,
    [Jobcat_name, Jobcat_description, Jobcat_id],
    (err, result) => {

      if (err) {
        console.log(err);
        return res.send({ success: false });
      }

      res.send({ success: true });

    });

});
/* ================================================= */
/* ================= JOB APIs ====================== */
/* ================================================= */

// Get Job List
app.get("/api/joblist", (req, res) => {

  const sql = `
    SELECT job.*, job_category.Jobcat_name
    FROM job
    LEFT JOIN job_category
    ON job.Jobcat_id = job_category.Jobcat_id
    ORDER BY job.Job_id DESC
  `;

  db.query(sql, (err, data) => {

    if (err) {
      return res.status(500).send(err);
    }

    res.send(data);

  });

});

// Add Job
app.post("/api/joblist", (req, res) => {

  const {
    Jobcat_id,
    Job_title,
    skill,
    end_date,
    description,
    location,
    salary,
    jobtype,
  } = req.body;

  const sql = `
    INSERT INTO job
    (Jobcat_id, Job_title, skill, post_date, end_date, description, location, salary, jobtype)
    VALUES (?, ?, ?, NOW(), ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [Jobcat_id, Job_title, skill, end_date, description, location, salary, jobtype],
    (err) => {

      if (err) {
        return res.status(500).send(err);
      }

      res.send({
        success: true,
        message: "Job Added Successfully",
      });

    }
  );

});

// Delete Job
app.delete("/api/deletejob/:id", (req, res) => {

  const sql = "DELETE FROM job WHERE Job_id=?";

  db.query(sql, [req.params.id], (err) => {

    if (err) {
      return res.status(500).send(err);
    }

    res.send({
      success: true,
      message: "Job Deleted Successfully",
    });

  });

});
// Get Single Job for Edit
app.post("/api/editjoblist", (req, res) => {

  const { Job_id } = req.body;

  const sql = "SELECT * FROM job WHERE Job_id = ?";

  db.query(sql, [Job_id], (err, data) => {

    if (err) {
      return res.status(500).send(err);
    }

    res.send(data[0]);

  });

});


// Update Job
app.post("/api/updatejoblist", (req, res) => {

  const {
    Job_id,
    Jobcat_id,
    Job_title,
    skill,
    end_date,
    description,
    location,
    salary,
    jobtype
  } = req.body;

  const sql = `
    UPDATE job SET
    Jobcat_id=?,
    Job_title=?,
    skill=?,
    end_date=?,
    description=?,
    location=?,
    salary=?,
    jobtype=?
    WHERE Job_id=?
  `;

  db.query(
    sql,
    [
      Jobcat_id,
      Job_title,
      skill,
      end_date,
      description,
      location,
      salary,
      jobtype,
      Job_id
    ],
    (err) => {

      if (err) {
        return res.status(500).send(err);
      }

      res.send({
        success: true,
        message: "Job Updated Successfully",
      });

    }
  );

});

/* ================================================= */
/* ================= COMPANY SIGNUP =============== */
/* ================================================= */

// Company Signup API
app.post("/api/signup", upload.single("id_proof"), (req, res) => {

  const {
    Company_name,
    contact_no,
    email,
    location,
    website_URL,
    description,
    password,
    company_person_name,
    company_person_contact
  } = req.body;

  const id_proof = req.file ? req.file.filename : null;

  // Validate required fields
  if (!Company_name || !contact_no || !email || !password) {
    return res.send({
      success: false,
      message: "Required fields are missing"
    });
  }

  // Check if email already exists
  const checkQuery = "SELECT * FROM company WHERE email = ?";

  db.query(checkQuery, [email], (err, results) => {

    if (err) {
      console.log(err);
      return res.status(500).send({
        success: false,
        message: "Error checking email"
      });
    }

    if (results.length > 0) {
      return res.send({
        success: false,
        message: "Email already exists"
      });
    }

    // Insert company data
    const insertQuery = `
      INSERT INTO company
      (Company_name, contact_no, email, id_proof, location, website_URL, description, password, company_person_name, company_person_contact, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `;

    db.query(
      insertQuery,
      [
        Company_name,
        contact_no,
        email,
        id_proof,
        location,
        website_URL,
        description,
        password,
        company_person_name,
        company_person_contact
      ],
      (err) => {

        if (err) {
          console.log(err);
          return res.status(500).send({
            success: false,
            message: "Error inserting data"
          });
        }

        res.send({
          success: true,
          message: "Signup successful. Waiting for admin approval."
        });

      }
    );

  });

});
/* ================================================= */
/* ================= EMPLOYER APIs ================= */
/* ================================================= */

// Get Employers
app.get("/api/getemployers", (req, res) => {

  const sql = "SELECT * FROM company";

  db.query(sql, (err, result) => {

    if (err) {
      return res.status(500).send({
        message: "Database error",
      });
    }

    res.send(result);

  });

});

// Approve Employer
app.post("/api/approveemployer", (req, res) => {

  const { Company_id } = req.body;

  const sql = "UPDATE company SET status=1 WHERE Company_id=?";

  db.query(sql, [Company_id], (err) => {

    if (err) {
      return res.status(500).send({
        message: "Database error",
      });
    }

    res.send({
      message: "Company approved successfully",
    });

  });

});

// Reject Employer
app.post("/api/rejectemployer", (req, res) => {

  const { Company_id } = req.body;

  const sql = "UPDATE company SET status=2 WHERE Company_id=?";

  db.query(sql, [Company_id], (err) => {

    if (err) {
      return res.status(500).send({
        message: "Database error",
      });
    }

    res.send({
      message: "Company rejected successfully",
    });

  });

});

// Company login 
app.post("/api/companylogin", (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {
    return res.send({
      success: false,
      message: "Email and password are required",
    });
  }

  const sql = "SELECT * FROM company WHERE email=? AND password=?";

  db.query(sql, [email, password], (err, result) => {

    if (err) {
      return res.send({
        success: false,
        message: "Database error",
      });
    }

    if (result.length === 0) {
      return res.send({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (result[0].status !== 1) {
      return res.send({
        success: false,
        message: "Your account is not approved by admin",
      });
    }

    res.send({
      success: true,
      message: "Login successful",
      company: result[0],
    });

  });

});


/* ================= USER SIGNUP API ================= */

app.post("/api/usersignup", upload.single("Upload_photo"), (req, res) => {

  console.log("BODY:", req.body);
  console.log("FILE:", req.file);

  const {
    Name,
    Contact_no,
    email,
    password,
    Address,
    Education,
    Experience,
    Projects
  } = req.body;

  const Upload_photo = req.file ? req.file.filename : "";

  const sql = `
  INSERT INTO job_seeker
  (Name, Contact_no, email, password, Address, Education, Experience, Projects, Upload_photo)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      Name,
      Contact_no,
      email,
      password,
      Address,
      Education,
      Experience,
      Projects,
      Upload_photo
    ],
    (err, result) => {

      if (err) {
        console.log("MYSQL ERROR:", err);

        return res.send({
          success: false,
          message: "Insert Error"
        });
      }

      res.send({
        success: true,
        message: "Registration Successful"
      });

    }
  );

});
//user login
app.post("/api/userlogin", (req, res) => {

  const { email, password } = req.body;

  const sql = "SELECT * FROM job_seeker WHERE email = ? AND password = ?";

  db.query(sql, [email, password], (err, result) => {

    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database error"
      });
    }

    if (result.length > 0) {

      return res.json({
        success: true,
        data: result
      });

    } else {

      return res.json({
        success: false,
        message: "Invalid Email or Password"
      });

    }

  });

});
/* ================= GET USER DATA  FOR RESUME================= */
app.get("/api/getuser/:id", (req, res) => {

  const id = req.params.id;

  const sql = "SELECT * FROM job_seeker WHERE id = ?";

  db.query(sql, [id], (err, result) => {

    if (err) {
      console.log(err);
      return res.send({
        success: false
      });
    }

    if (result.length === 0) {
      return res.send({
        success: false
      });
    }

    res.send({
      success: true,
      data: result[0] // return single object
    });

  });

});
/* ================= SERVER ================= */

app.listen(1337, () => {
  console.log("Server running on http://localhost:1337");
});