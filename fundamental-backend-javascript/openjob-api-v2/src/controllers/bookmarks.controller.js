const crypto = require("crypto");
const pool = require("../config/db");
const NotFoundError = require("../exceptions/NotFoundError");
const redisClient = require("../services/redis.service");

const createBookmark = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { job_id } = req.params;
    const id = `bookmark-${crypto.randomUUID()}`;

    const query = "INSERT INTO bookmarks (id, user_id, job_id) VALUES ($1, $2, $3) RETURNING id";
    const result = await pool.query(query, [id, userId, job_id]);

    await redisClient.del(`bookmarks:user:${userId}`);

    res.status(201).json({
      status: "success",
      message: "Job berhasil dibookmark",
      data: { id: result.rows[0].id },
    });
  } catch (err) {
    next(err);
  }
};

const getAllBookmarks = async (req, res, next) => {
  try {
    const cacheKey = `bookmarks:user:${req.user.id}`;
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      res.set("X-Data-Source", "cache");
      return res.status(200).json({ status: "success", data: JSON.parse(cachedData) });
    }

    const query = `SELECT b.id, b.user_id, b.job_id, 
             j.title, j.description, j.company_id, j.category_id, j.job_type, j.experience_level, 
             j.location_type, j.location_city, j.salary_min, j.salary_max, j.is_salary_visible, j.status, 
             c.name AS company_name, cat.name AS category_name, u.name AS recruiter_name
      FROM bookmarks b 
      JOIN jobs j ON b.job_id = j.id 
      JOIN companies c ON j.company_id = c.id
      JOIN categories cat ON j.category_id = cat.id
      JOIN users u ON j.recruiter_id = u.id
      WHERE b.user_id = $1
    `;
    const result = await pool.query(query, [req.user.id]);

    await redisClient.setEx(cacheKey, 3600, JSON.stringify({ bookmarks: result.rows }));

    res.set("X-Data-Source", "database");
    res.status(200).json({
      status: "success",
      data: { bookmarks: result.rows },
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

    await redisClient.del(`bookmarks:user:${req.user.id}`);

    res.status(200).json({
      status: "success",
      message: "Bookmark berhasil dihapus",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { createBookmark, getBookmarkDetail, deleteBookmark, getAllBookmarks };
