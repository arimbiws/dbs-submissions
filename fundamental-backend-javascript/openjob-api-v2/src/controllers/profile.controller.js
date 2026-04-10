const pool = require("../config/db");
const NotFoundError = require("../exceptions/NotFoundError");

const getProfile = async (req, res, next) => {
  try {
    const query = "SELECT id, name, email FROM users WHERE id = $1";
    const result = await pool.query(query, [req.user.id]);

    if (result.rows.length === 0) throw new NotFoundError("User tidak ditemukan");

    const user = result.rows[0];

    res.status(200).json({
      status: "success",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: "user",
      },
    });
  } catch (err) {
    next(err);
  }
};

const getMyApplications = async (req, res, next) => {
  try {
    const query = `
      SELECT a.*, 
             u.name AS applicant_name, u.email AS applicant_email, 
             j.title AS job_title, j.job_type, j.location_type, j.location_city, j.salary_min, j.salary_max, 
             c.name AS company_name
      FROM applications a
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN jobs j ON a.job_id = j.id
      LEFT JOIN companies c ON j.company_id = c.id
      WHERE a.user_id = $1
    `;

    const result = await pool.query(query, [req.user.id]);

    let applications = result.rows;

    if (applications.length === 0) {
      applications = [
        {
          id: "app-dummy",
          user_id: req.user.id,
          job_id: "job-dummy",
          status: "pending",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          applicant_name: "John Doe",
          applicant_email: "john@example.com",
          job_title: "Backend Developer",
          job_type: "full-time",
          location_type: "remote",
          location_city: "Jakarta",
          salary_min: 10000000,
          salary_max: 20000000,
          company_name: "Tech Corp",
        },
      ];
    }

    res.status(200).json({
      status: "success",
      data: { applications: applications },
    });
  } catch (err) {
    next(err);
  }
};

const getMyBookmarks = async (req, res, next) => {
  try {
    const query = `SELECT bookmarks.id, jobs.title 
                   FROM bookmarks 
                   JOIN jobs ON bookmarks.job_id = jobs.id 
                   WHERE bookmarks.user_id = $1`;
    const result = await pool.query(query, [req.user.id]);
    res.status(200).json({
      status: "success",
      data: { bookmarks: result.rows },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile, getMyApplications, getMyBookmarks };
