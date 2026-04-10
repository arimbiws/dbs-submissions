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
    const query = `SELECT applications.id, applications.status, jobs.title AS job_title 
                   FROM applications 
                   JOIN jobs ON applications.job_id = jobs.id 
                   WHERE applications.user_id = $1`;
    const result = await pool.query(query, [req.user.id]);
    res.status(200).json({
      status: "success",
      data: { applications: result.rows },
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
