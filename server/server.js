const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/debug-check", (req, res) => {
  res.json({ message: "Antigravity Server v2 Running", time: new Date() });
});

app.get("/api/test-rec", (req, res) => {
  res.json({ message: "Test Rec API is working" });
});

// Recommended Jobs based on User Skills
app.get("/api/recommended-jobs/:userId", (req, res) => {
  const userId = req.params.userId;
  console.log("-> Recommended Jobs Request for User:", userId);

  // 1. Get User Skills
  const userSql = "SELECT Skills FROM job_seeker WHERE id = ?";
  db.query(userSql, [userId], (err, userResult) => {
    if (err) {
        console.log("   - DB Error fetching user skills:", err);
        return res.json({ success: false, data: [] });
    }
    if (userResult.length === 0) {
      console.log("   - User not found in job_seeker table");
      return res.json({ success: false, data: [] });
    }

    const userSkills = userResult[0].Skills || "";
    console.log("   - User Skills found:", userSkills);
    
    if (!userSkills.trim()) {
      return res.json({ success: true, data: [] });
    }

    // Split skills by comma and clean them
    const skillsList = userSkills
      .split(",")
      .map(s => s.trim().replace(/[()]/g, "")) // Remove parentheses
      .filter(s => s.length > 1); // Ignore single characters or empty

    console.log("   - Cleaned Skills List:", skillsList);

    if (skillsList.length === 0) {
      return res.json({ success: true, data: [] });
    }

    // 2. Search for jobs matching any of these skills
    let jobSql = `
      SELECT j.*, c.Jobcat_name, comp.Company_name 
      FROM job j
      LEFT JOIN job_category c ON j.Jobcat_id = c.Jobcat_id
      LEFT JOIN company comp ON j.Company_id = comp.Company_id
      WHERE (
    `;
    const searchTerms = [];
    skillsList.forEach((skill, index) => {
      jobSql += `j.skill LIKE ? ${index < skillsList.length - 1 ? "OR " : ""}`;
      searchTerms.push(`%${skill}%`);
    });
    jobSql += `) 
      AND (j.end_date >= CURDATE() OR j.end_date IS NULL OR j.end_date = '')
      ORDER BY j.Job_id DESC LIMIT 10`;

    console.log("   - Job Matching Query running...");
    db.query(jobSql, searchTerms, (err, jobResult) => {
        if (err) {
            console.log("   - DB Error matching jobs:", err);
            return res.json({ success: false, data: [] });
        }
        console.log(`   - Found ${jobResult.length} matches`);
      res.json({ success: true, data: jobResult });
    });
  });
});

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
// ✅ Multer Storage Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// ✅ File Filter (only resume files)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx|jpg|jpeg|png/;

  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, DOC, DOCX, JPG, PNG allowed"), false);
  }
};

// ✅ Multer Upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: fileFilter,
});

/* ================================================= */
/* ================= CATEGORY APIs ================= */
/* ================================================= */

// Get Categories
app.get("/api/jobcategories", (req, res) => {
  const { Company_id } = req.query;
  let sql = "SELECT * FROM job_category ORDER BY Jobcat_id DESC";
  let params = [];

  if (Company_id) {
    sql =
      "SELECT * FROM job_category WHERE Company_id = ? ORDER BY Jobcat_id DESC";
    params.push(Company_id);
  }

  db.query(sql, params, (err, data) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send(data);
  });
});

// ================= ADD CATEGORY =================
// ✅ ADD CATEGORY API
app.post("/api/add-category", (req, res) => {
  const { Jobcat_name, Jobcat_description, Company_id } = req.body;

  if (!Jobcat_name || !Jobcat_description || !Company_id) {
    return res.json({
      success: false,
      error: "All fields are required",
    });
  }

  const sql = `
    INSERT INTO job_category (Jobcat_name, Jobcat_description, Company_id)
    VALUES (?, ?, ?)
  `;

  db.query(
    sql,
    [Jobcat_name, Jobcat_description, Company_id],
    (err, result) => {
      if (err) {
        console.log("SQL ERROR:", err);
        return res.json({
          success: false,
          error: "Database error",
        });
      }

      return res.json({
        success: true,
        message: "Category added successfully",
      });
    },
  );
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

  db.query(sql, [Jobcat_name, Jobcat_description, Jobcat_id], (err, result) => {
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

// Removed duplicate GET /api/jobcategories

// ================= ADD JOB =================
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
    Company_id,
  } = req.body;

  const sql = `
    INSERT INTO job
    (Jobcat_id, Job_title, skill, post_date, end_date, description, location, salary, jobtype, Company_id)
    VALUES (?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?)
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
      Company_id,
    ],
    (err, result) => {
      if (err) {
        console.log("DB ERROR:", err);
        return res.send({ success: false, error: err.sqlMessage });
      }
      res.send({ success: true });
    },
  );
});

// ================= GET JOB LIST Admin View Joblist=================
app.get("/api/joblist", (req, res) => {
  const { Company_id } = req.query;

  let sql = `
    SELECT j.*, c.Jobcat_name, c.Jobcat_description
    FROM job j
    LEFT JOIN job_category c 
    ON j.Jobcat_id = c.Jobcat_id
  `;
  const params = [];

  if (Company_id) {
    sql += ` WHERE j.Company_id = ? `;
    params.push(Company_id);
  }

  sql += ` ORDER BY j.Job_id DESC`;

  db.query(sql, params, (err, result) => {
    if (err) {
      console.log("DB ERROR:", err); // ✅ log error
      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    res.status(200).json({
      success: true,
      data: result || [], // ✅ always return array
    });
  });
});
// ================= DELETE JOB =================
app.delete("/api/deletejob/:id", (req, res) => {
  const sql = "DELETE FROM job WHERE Job_id=?";

  db.query(sql, [req.params.id], (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }

    res.send({
      success: true,
      message: "Job Deleted Successfully",
    });
  });
});

// ================= GET SINGLE JOB BY ID =================
app.get("/api/job/:id", (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT j.*, 
           c.Jobcat_name, c.Jobcat_description, 
           comp.Company_name, comp.email AS Company_email, comp.contact_no AS Company_contact, comp.website_URL, comp.location AS Company_location
    FROM job j
    LEFT JOIN job_category c ON j.Jobcat_id = c.Jobcat_id
    LEFT JOIN company comp ON j.Company_id = comp.Company_id
    WHERE j.Job_id = ?
  `;

  db.query(sql, [id], (err, data) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .send({ success: false, message: "Database Error" });
    }

    if (data.length > 0) {
      res.send({ success: true, data: data[0] });
    } else {
      res.send({ success: false, message: "Job not found" });
    }
  });
});

// ================= GET SINGLE JOB =================
app.post("/api/editjoblist", (req, res) => {
  const { Job_id } = req.body;

  const sql = "SELECT * FROM job WHERE Job_id = ?";

  db.query(sql, [Job_id], (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }

    res.send(data[0]);
  });
});

// ================= UPDATE JOB =================
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
    jobtype,
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
      Job_id,
    ],
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }

      res.send({
        success: true,
        message: "Job Updated Successfully",
      });
    },
  );
});

// ================= GET COMPANIES (FOR HOME PAGE) =================
app.get("/api/companies", (req, res) => {
  const sql = "SELECT * FROM company ORDER BY Company_id DESC";

  db.query(sql, (err, result) => {
    if (err) {
      return res.json({ success: false });
    }

    res.json({
      success: true,
      data: result, // ✅ IMPORTANT
    });
  });
});

// ================= GET LOCATIONS (FOR HOME PAGE) =================
app.get("/api/locations", (req, res) => {
  const sql = `
    SELECT DISTINCT location AS location_id, location 
    FROM job 
    WHERE location IS NOT NULL AND location != ''
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err });
    res.json({ success: true, data: result });
  });
});

// ================= SEARCH JOBS (FOR HOME PAGE) =================
app.get("/api/search-jobs", (req, res) => {
  const { keyword, Company_id, location } = req.query;

  let sql = `
    SELECT j.*, c.Jobcat_description 
    FROM job j
    LEFT JOIN job_category c ON j.Jobcat_id = c.Jobcat_id
    WHERE 1=1
  `;
  const params = [];

  if (keyword) {
    sql += ` AND j.Job_title LIKE ?`;
    params.push("%" + keyword + "%");
  }
  if (Company_id) {
    sql += ` AND j.Company_id = ?`;
    params.push(Company_id);
  }
  if (location) {
    sql += ` AND j.location = ?`;
    params.push(location);
  }

  sql += ` ORDER BY j.Job_id DESC`;

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err });
    res.json(result);
  });
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
    company_person_contact,
  } = req.body;

  const id_proof = req.file ? req.file.filename : null;

  // Validate required fields
  if (!Company_name || !contact_no || !email || !password) {
    return res.send({
      success: false,
      message: "Required fields are missing",
    });
  }

  // Check if email already exists
  const checkQuery = "SELECT * FROM company WHERE email = ?";

  db.query(checkQuery, [email], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        success: false,
        message: "Error checking email",
      });
    }

    if (results.length > 0) {
      return res.send({
        success: false,
        message: "Email already exists",
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
        company_person_contact,
      ],
      (err) => {
        if (err) {
          console.log(err);
          return res.status(500).send({
            success: false,
            message: "Error inserting data",
          });
        }

        res.send({
          success: true,
          message: "Signup successful. Waiting for admin approval.",
        });
      },
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
//user login
app.post("/api/userlogin", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: "Email and password required" });
  }

  const sql = "SELECT * FROM job_seeker WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, result) => {
    if (err) {
      console.log("LOGIN DB ERROR:", err);
      return res
        .status(500)
        .json({ success: false, message: "Database failure" });
    }

    if (result.length > 0) {
      const user = result[0];

      // Check if user is blocked
      if (user.status === 0) {
        return res.json({
          success: false,
          message: "Your account is blocked by admin. Please contact support.",
        });
      }

      res.json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          Name: user.Name,
        },
      });
    } else {
      res.json({ success: false, message: "Invalid Email or Password" });
    }
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
    Skills,
    Experience,
    Company_name,
    Post,
    Duration,
    Work_description,
  } = req.body;

  const Upload_photo = req.file ? req.file.filename : "";

  const sql = `
  INSERT INTO job_seeker
  (Name, Contact_no, email, password, Address, Education,Skills, Experience, Upload_photo,Company_name,Post,Duration,Work_description)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?)
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
      Skills,
      Experience,
      Upload_photo,
      Company_name,
      Post,
      Duration,
      Work_description,
    ],
    (err, result) => {
      if (err) {
        console.log("MYSQL ERROR:", err);

        return res.send({
          success: false,
          message: "Insert Error",
        });
      }

      res.send({
        success: true,
        message: "Registration Successful",
      });
    },
  );
});

/* ================= GET USER DATA  FOR My RESUME================= */

app.get("/api/getuser/:id", (req, res) => {
  const id = req.params.id;

  const sql = "SELECT * FROM job_seeker WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.send({
        success: false,
        message: "Database error",
      });
    }

    if (result.length === 0) {
      return res.send({
        success: false,
        message: "User not found",
      });
    }

    // send the first object from result
    res.send({
      success: true,
      data: result[0],
    });
  });
});

// ✅ Upload upload resume API
app.post("/uploadresume", upload.single("resume"), (req, res) => {
  try {
    const file = req.file;

    // ❌ Check if file exists
    if (!file) {
      return res.status(400).json({
        status: "error",
        message: "No file uploaded",
      });
    }

    // ✅ File name
    const fileName = file.filename;

    // ✅ Insert into database
    const sql = "INSERT INTO resumes(file_name) VALUES (?)";

    db.query(sql, [fileName], (err, result) => {
      // ❌ DB error
      if (err) {
        console.log("DB ERROR:", err);
        return res.status(500).json({
          status: "error",
          message: "Database error",
        });
      }

      // ✅ Success response
      return res.status(200).json({
        status: "success",
        message: "Resume uploaded successfully",
        file: fileName,
        url: `http://localhost:1337/uploads/${fileName}`,
        id: result.insertId,
      });
    });
  } catch (error) {
    console.log("SERVER ERROR:", error);

    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
});

// Removed duplicate GET /api/joblist

/* ===== APPLY JOB ===== */
app.post("/api/apply", (req, res) => {
  const { Job_id, User_id, Company_id, description } = req.body;

  const sql = `
    INSERT INTO applied (Job_id, User_id, Company_id, description, status)
    VALUES (?, ?, ?, ?, 'Pending')
  `;

  db.query(sql, [Job_id, User_id, Company_id, description], (err) => {
    if (err) {
      console.log(err);
      return res.json({ success: false });
    }

    res.json({ success: true });
  });
});
/* ===== UPDATE STATUS ===== */
app.put("/api/update-status/:id", (req, res) => {
  const { status } = req.body;

  const sql = "UPDATE applied SET status=? WHERE id=?";

  db.query(sql, [status, req.params.id], (err) => {
    if (err) return res.json({ success: false });

    res.json({ success: true });
  });
});

/* ===== DELETE ===== */
app.delete("/api/delete-application/:id", (req, res) => {
  const sql = "DELETE FROM applied WHERE id=?";

  db.query(sql, [req.params.id], (err) => {
    if (err) return res.json({ success: false });

    res.json({ success: true });
  });
});

/* ===== GET APPLIED JOBS (USER) ===== */
app.get("/api/applied/:userId", (req, res) => {
  const sql = "SELECT Job_id FROM applied WHERE User_id=?";

  db.query(sql, [req.params.userId], (err, result) => {
    if (err) return res.json([]);

    res.json(result);
  });
});

/* ===== MANAGE CANDIDATES ===== */
app.get("/api/manage-candidates", (req, res) => {
  const sql = `
    SELECT 
      a.id,
      a.status,
      a.Company_id,
      js.Name as name,
      js.email,
      j.Job_title
    FROM applied a
    JOIN job_seeker js ON a.User_id = js.id
    JOIN job j ON a.Job_id = j.Job_id
    ORDER BY a.id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ success: false });
    }

    res.json({
      success: true,
      data: result,
    });
  });
});

app.get("/api/categories", (req, res) => {
  const sql = `
    SELECT jc.Jobcat_id, jc.Jobcat_name,
           COUNT(j.Job_id) AS total_jobs
    FROM job_category jc
    LEFT JOIN job j ON j.Jobcat_id = jc.Jobcat_id
    GROUP BY jc.Jobcat_id
  `;

  db.query(sql, (err, result) => {
    if (err) return res.json([]);
    res.json(result);
  });
});

// ===== GET ALL INTERVIEWS =====
app.get("/api/interviews/:companyId", (req, res) => {
  const { companyId } = req.params;
  const sql = `
    SELECT i.*, js.email AS candidateEmail, a.status AS candidateStatus
    FROM interview i
    JOIN applied a ON i.candidateId = a.id
    JOIN job_seeker js ON a.User_id = js.id
    WHERE i.companyId = ? 
    ORDER BY i.id DESC
  `;
  db.query(sql, [companyId], (err, result) => {
    if (err) {
      console.log("FETCH INT INTERVIEW ERROR:", err);
      return res.json({ success: false });
    }
    res.json({ success: true, data: result });
  });
});

// ===== ADD INTERVIEW =====
app.post("/api/add-interview", (req, res) => {
  const { candidateId, name, job, date, time, mode, location, companyId } =
    req.body;

  const sql = `
    INSERT INTO interview 
    (candidateId, name, job, date, time, mode, location, companyId)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [candidateId, name, job, date, time, mode, location, companyId],
    (err) => {
      if (err) {
        console.log(err);
        return res.json({ success: false });
      }

      // Update status in applied table
      const updateSql =
        "UPDATE applied SET status = 'Interview Scheduled' WHERE id = ?";
      db.query(updateSql, [candidateId], (updateErr) => {
        if (updateErr) {
          console.log("Error updating applied status:", updateErr);
        }
        res.json({ success: true });
      });
    },
  );
});

// ===== DELETE INTERVIEW =====
app.delete("/api/delete-interview/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM interview WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.json({ success: false });
    res.json({ success: true });
  });
});

// ================= SHORTLISTED CANDIDATES =================
app.get("/api/shortlisted-candidates/:companyId", (req, res) => {
  const { companyId } = req.params;

  const sql = `
    SELECT 
      a.id AS applied_id,
      js.Name AS name,
      j.Job_title
    FROM applied a
    JOIN job_seeker js ON a.User_id = js.id
    JOIN job j ON a.Job_id = j.Job_id
    WHERE a.Company_id = ? AND a.status = 'Shortlisted'
  `;

  db.query(sql, [companyId], (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ success: false });
    }

    res.json({ success: true, data: result });
  });
});

//application
app.get("/api/my-applications/:userId", (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT 
      a.id,
      c.Company_name AS company_name,
      j.Job_title AS job_title,
      a.status,
      i.date AS intv_date,
      i.time AS intv_time,
      i.mode AS intv_mode,
      i.location AS intv_location

    FROM applied a

    JOIN job j ON a.Job_id = j.Job_id
    JOIN company c ON a.Company_id = c.Company_id

    -- ✅ ONLY MATCHED INTERVIEWS
    INNER JOIN interview i 
      ON i.candidateId = a.id

    WHERE a.User_id = ?

    ORDER BY i.date ASC, i.time ASC
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.log("DB ERROR:", err);
      return res.json({ success: false });
    }

    console.log("DATA:", result); // 🔥 DEBUG

    res.json({
      success: true,
      data: result,
    });
  });
});

// ================= COmpany DASHBOARD =================
app.get("/api/companyDashboard/:id", (req, res) => {
  const companyId = req.params.id;

  const sql = `
    SELECT 
      (SELECT COUNT(*) FROM job WHERE Company_id = ?) AS totalJobs,
      (SELECT COUNT(*) FROM applied WHERE Company_id = ?) AS totalApplications,
      (SELECT COUNT(*) FROM applied 
        WHERE Company_id = ? AND LOWER(status) = 'shortlisted') AS shortlisted,
      (SELECT COUNT(*) FROM applied 
        WHERE Company_id = ? AND LOWER(status) = 'rejected') AS rejected,
      (SELECT COUNT(*) FROM applied 
        WHERE Company_id = ? AND LOWER(status) = 'interview scheduled') AS scheduled
  `;

  db.query(
    sql,
    [companyId, companyId, companyId, companyId, companyId],
    (err, result) => {
      if (err) {
        console.log("Dashboard Error:", err);
        return res.json({
          totalJobs: 0,
          totalApplications: 0,
          shortlisted: 0,
          approved: 0,
          rejected: 0,
          scheduled: 0,
        });
      }

      const data = result[0] || {};
      // Ensure both shortlisted and approved are present for compatibility
      res.json({
        totalJobs: data.totalJobs || 0,
        totalApplications: data.totalApplications || 0,
        shortlisted: data.shortlisted || 0,
        approved: data.shortlisted || 0, // Mapping for safety
        rejected: data.rejected || 0,
        scheduled: data.scheduled || 0,
      });
    },
  );
});

// ================= RECENT =================
app.get("/api/recentApplications/:id", (req, res) => {
  const companyId = req.params.id;

  const sql = `
    SELECT 
      js.Name,
      j.Job_title AS job_title,
      a.status AS Status

    FROM applied a
    JOIN job_seeker js ON a.User_id = js.id
    JOIN job j ON a.Job_id = j.Job_id

    WHERE a.Company_id = ?
    ORDER BY a.id DESC
    LIMIT 5
  `;

  db.query(sql, [companyId], (err, result) => {
    if (err) {
      console.log("Recent Error:", err);
      return res.json([]);
    }

    res.json(result);
  });
});

//admin Login Page
/* ================= ADMIN LOGIN ================= */
app.post("/api/adminlogin", (req, res) => {
  console.log("BODY:", req.body); // 🔥 DEBUG

  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      status: "error",
      message: "Email and password required",
    });
  }

  const sql =
    "SELECT * FROM admin_login WHERE admin_email = ? AND admin_password = ?";

  db.query(sql, [email, password], (err, result) => {
    if (err) {
      console.log("DB ERROR:", err); // 🔥 SEE ERROR HERE
      return res.json({
        status: "error",
        message: "Database error",
      });
    }

    console.log("RESULT:", result); // 🔥 DEBUG

    if (result.length > 0) {
      return res.json({
        status: "success",
        admin: result[0],
      });
    } else {
      return res.json({
        status: "error",
        message: "Invalid Email or Password",
      });
    }
  });
});

/* ================= ADMIN DASHBOARD ================= */
app.get("/api/adminDashboard", (req, res) => {
  const sql = `
    SELECT
      (SELECT COUNT(*) FROM company) AS totalCompanies,
      (SELECT COUNT(*) FROM job) AS totalJobs,
      (SELECT COUNT(*) FROM applied) AS totalApplications,
      (SELECT COUNT(*) FROM interview) AS totalInterviews
  `;
  db.query(sql, (err, result) => {
    if (err) {
      console.log("Dashboard Error:", err);
      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    res.json(result[0]);
  });
});

// Get all job seekers
app.get("/api/jobseekers", (req, res) => {
  const sql =
    "SELECT id, Name, email, Contact_no, Skills, status FROM job_seeker";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ status: "error", message: err });
    res.json({ status: "success", data: result });
  });
});

// Toggle user status (active/block)
app.post("/api/toggleUserStatus", (req, res) => {
  const { id } = req.body;
  if (!id)
    return res
      .status(400)
      .json({ status: "error", message: "User ID required" });

  // Get current status
  db.query(
    "SELECT status FROM job_seeker WHERE id = ?",
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ status: "error", message: err });
      if (result.length === 0)
        return res
          .status(404)
          .json({ status: "error", message: "User not found" });

      const newStatus = result[0].status === 1 ? 0 : 1;
      db.query(
        "UPDATE job_seeker SET status = ? WHERE id = ?",
        [newStatus, id],
        (err2) => {
          if (err2)
            return res.status(500).json({ status: "error", message: err2 });
          res.json({ status: "success", newStatus });
        },
      );
    },
  );
});

// ======================================================
// ==========================================================
// ✅ GET USER (for edit form)
app.get("/api/getuser/:id", (req, res) => {
  const id = req.params.id;

  // 🔥 IMPORTANT: change table name here if needed
  const sql = "SELECT * FROM user WHERE id=?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.log("GET ERROR:", err);
      return res.json({ success: false });
    }

    if (result.length > 0) {
      res.json({ success: true, data: result[0] });
    } else {
      res.json({ success: false });
    }
  });
});

// ==========================================================
// ✅ UPDATE USER (MAIN FIXED API)
app.post("/api/updateuser/:id", upload.single("Upload_photo"), (req, res) => {
  const id = req.params.id;

  console.log("BODY:", req.body);
  console.log("FILE:", req.file);

  const {
    Name,
    email,
    Contact_no,
    Address,
    Education,
    Skills,
    Experience,
    Company_name,
    Post,
    Duration,
    Work_description,
  } = req.body;

  // ✅ CHECK IF DATA IS COMING
  if (!Name || !email) {
    return res.json({ success: false, msg: "No data received from frontend" });
  }

  const table = "job_seeker"; // ✅ YOUR TABLE

  // 🔥 SIMPLE TEST QUERY FIRST (VERY IMPORTANT)
  db.query(
    `UPDATE ${table} SET Name=? WHERE id=?`,
    [Name, id],
    (err, result) => {
      if (err) {
        console.log("TEST ERROR:", err);
        return res.json({ success: false, msg: err.message });
      }

      // ================= FULL UPDATE =================
      let sql = "";
      let values = [];

      if (req.file) {
        sql = `
          UPDATE ${table} SET
          Name=?, email=?, Contact_no=?, Address=?,
          Education=?, Skills=?, Experience=?,
          Company_name=?, Post=?, Duration=?, Work_description=?,
          Upload_photo=?
          WHERE id=?
        `;

        values = [
          Name,
          email,
          Contact_no,
          Address,
          Education,
          Skills,
          Experience,
          Company_name,
          Post,
          Duration,
          Work_description,
          req.file.filename,
          id,
        ];
      } else {
        sql = `
          UPDATE ${table} SET
          Name=?, email=?, Contact_no=?, Address=?,
          Education=?, Skills=?, Experience=?,
          Company_name=?, Post=?, Duration=?, Work_description=?
          WHERE id=?
        `;

        values = [
          Name,
          email,
          Contact_no,
          Address,
          Education,
          Skills,
          Experience,
          Company_name,
          Post,
          Duration,
          Work_description,
          id,
        ];
      }

      db.query(sql, values, (err, result) => {
        if (err) {
          console.log("SQL ERROR:", err);
          return res.json({ success: false, msg: err.message });
        }

        console.log("UPDATE SUCCESS ✅");
        res.json({ success: true });
      });
    },
  );
});

// Sample blog data
const blogs = [
  {
    id: 1,
    title: "How to Ace Your First Job",
    description: "Tips and tricks for fresh graduates to succeed in interviews and landing their first job.",
    category: "Career",
    image: "https://via.placeholder.com/400x200.png?text=Blog+1"
  },
  {
    id: 2,
    title: "Top 10 Skills in 2026",
    description: "Learn which skills are in demand this year and how to improve yourself.",
    category: "Skills",
    image: "https://via.placeholder.com/400x200.png?text=Blog+2"
  },
  {
    id: 3,
    title: "Work-Life Balance Tips",
    description: "How to maintain a healthy balance between your career and personal life.",
    category: "Lifestyle",
    image: "https://via.placeholder.com/400x200.png?text=Blog+3"
  },
];

// API to get blogs
app.get("/api/blogs", (req, res) => {
  res.json({ success: true, data: blogs });
});


// Login API
// app.post("/api/login", (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ success: false, message: "All fields are required" });
//   }

//   const user = users.find(u => u.email === email && u.password === password);

//   if (user) {
//     return res.json({ success: true, message: "Login successful" });
//   } else {
//     return res.status(401).json({ success: false, message: "Invalid email or password" });
//   }
// DELETED MOVED ROUTE

// });

/* ================= MESSAGE APIs ================= */

// Send message (User → Company OR Company → User)
app.post("/api/send-message", (req, res) => {
  const { sender, email, subject, message, company, job, type } = req.body;
  const msgType = type || 'chat'; // Default to chat

  const sql = `
    INSERT INTO messages (sender, email, subject, message, company, job, type, reply)
    VALUES (?, ?, ?, ?, ?, ?, ?, '')
  `;

  db.query(
    sql,
    [sender, email, subject, message, company, job, msgType],
    (err, result) => {
      if (err) {
        console.log("SEND MESSAGE ERROR:", err);
        return res.json({ success: false, error: err.message });
      }
      res.json({ success: true, id: result.insertId });
    }
  );
});

// Get messages (Company side)
app.get("/api/company-messages", (req, res) => {
  const { company, type } = req.query;
  const searchName = (company || "").trim().toLowerCase();

  let sql = "SELECT * FROM messages WHERE LOWER(TRIM(company)) = ?";
  let params = [searchName];

  if (type) {
    sql += " AND type = ?";
    params.push(type);
  }

  sql += " ORDER BY id DESC";

  db.query(sql, params, (err, result) => {
    if (err) {
      console.log("FETCH COMPANY MSGS ERROR:", err);
      return res.json({ success: false, error: err.message });
    }
    res.json({ success: true, data: result });
  });
});

// Get messages (User side notifications)
app.get("/api/user-messages", (req, res) => {
  const { email, type } = req.query;
  const searchEmail = (email || "").trim().toLowerCase();

  let sql = "SELECT * FROM messages WHERE LOWER(TRIM(email)) = ?";
  let params = [searchEmail];

  if (type) {
    sql += " AND type = ?";
    params.push(type);
  }

  sql += " ORDER BY id DESC";

  db.query(sql, params, (err, result) => {
    if (err) {
      console.log("FETCH USER MSGS ERROR:", err);
      return res.json({ success: false, error: err.message });
    }
    res.json({ success: true, data: result });
  });
});

// Reply (Company → User)
app.post("/api/reply", (req, res) => {
  const { id, reply } = req.body;

  const sql = "UPDATE messages SET reply = ? WHERE id = ?";

  db.query(sql, [reply, id], (err, result) => {
    if (err) {
      console.log("REPLY ERROR:", err);
      return res.json({ success: false, error: err.message });
    }
    res.json({ success: true });
  });
});

/* ================= SERVER ================= */

app.listen(1337, () => {
  console.log("Server running on http://localhost:1337");
});

// const photoPath = path.join(__dirname,"uploads",user.Upload_photo);
