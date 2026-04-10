const crypto = require("crypto");
const pool = require("../config/db");
const NotFoundError = require("../exceptions/NotFoundError");

const createBookmark = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { job_id } = req.params;
    const id = `bookmark-${crypto.randomUUID()}`;

    const query = "INSERT INTO bookmarks (id, user_id, job_id) VALUES ($1, $2, $3) RETURNING id";
    const result = await pool.query(query, [id, userId, job_id]);

    res.status(201).json({
      status: "success",
      message: "Job berhasil dibookmark",
      data: { id: result.rows[0].id },
    });
  } catch (err) {
    next(err);
  }
};

const getBookmarkDetail = async (req, res, next) => {
  try {
    const { id, job_id } = req.params;

    const query = `SELECT bookmarks.id, jobs.title, jobs.description 
                   FROM bookmarks 
                   JOIN jobs ON bookmarks.job_id = jobs.id 
                   WHERE bookmarks.id = $1 AND bookmarks.job_id = $2 AND bookmarks.user_id = $3`;
    const result = await pool.query(query, [id, job_id, req.user.id]);

    if (result.rows.length === 0) throw new NotFoundError("Bookmark tidak ditemukan");
    res.status(200).json({
      status: "success",
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

const deleteBookmark = async (req, res, next) => {
  try {
    const { job_id } = req.params;
    const userId = req.user.id;

    const result = await pool.query("DELETE FROM bookmarks WHERE job_id = $1 AND user_id = $2 RETURNING id", [job_id, userId]);
    if (result.rows.length === 0) throw new NotFoundError("Gagal menghapus, Bookmark tidak ditemukan");

    res.status(200).json({
      status: "success",
      message: "Bookmark berhasil dihapus",
    });
  } catch (err) {
    next(err);
  }
};

const getAllBookmarks = async (req, res, next) => {
  try {
    const query = `SELECT bookmarks.id, jobs.title, companies.name AS company_name 
                   FROM bookmarks 
                   JOIN jobs ON bookmarks.job_id = jobs.id 
                   JOIN companies ON jobs.company_id = companies.id
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

module.exports = { createBookmark, getBookmarkDetail, deleteBookmark, getAllBookmarks };
