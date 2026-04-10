const crypto = require("crypto");
const pool = require("../config/db");
const NotFoundError = require("../exceptions/NotFoundError");
const ClientError = require("../exceptions/ClientError");
const { ApplicationSchema, ApplicationStatusSchema } = require("../validations/schemas");
const redisClient = require("../services/redis.service");
const rabbitmqService = require("../services/rabbitmq.service");

const applyJob = async (req, res, next) => {
  try {
    const { error } = ApplicationSchema.validate(req.body);
    if (error) throw error;

    const jobId = req.body.job_id || req.body.jobId;
    if (!jobId) return res.status(400).json({ status: "failed", message: "ID Pekerjaan (job_id) tidak boleh kosong" });
    const userId = req.user.id;

    const checkJob = await pool.query("SELECT id FROM jobs WHERE id = $1", [jobId]);
    if (checkJob.rows.length === 0) return res.status(404).json({ status: "failed", message: "Pekerjaan tidak ditemukan" });

    const checkDuplicate = await pool.query("SELECT id FROM applications WHERE user_id = $1 AND job_id = $2", [userId, jobId]);
    if (checkDuplicate.rows.length > 0) return res.status(400).json({ status: "failed", message: "Anda sudah melamar pekerjaan ini" });

    const id = `app-${crypto.randomUUID()}`;
    const status = "pending";

    const query = "INSERT INTO applications (id, user_id, job_id, status) VALUES ($1, $2, $3, $4) RETURNING id";
    const result = await pool.query(query, [id, userId, jobId, status]);

    await redisClient.del(`applications:user:${userId}`);
    await redisClient.del(`applications:job:${jobId}`);

    await rabbitmqService.sendMessage("application:process", JSON.stringify({ application_id: id }));

    res.status(201).json({
      status: "success",
      message: "Berhasil melamar pekerjaan",
      data: {
        id: result.rows[0].id,
        user_id: userId,
        job_id: jobId,
        status: status,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getAllApplications = async (req, res, next) => {
  try {
    const query = `
      SELECT a.id, a.user_id, a.job_id, a.status, 
             u.name AS applicant_name, u.email AS applicant_email, 
             j.title AS job_title, j.job_type, j.location_type, j.location_city, j.salary_min, j.salary_max, 
             c.name AS company_name
      FROM applications a
      JOIN users u ON a.user_id = u.id
      JOIN jobs j ON a.job_id = j.id
      JOIN companies c ON j.company_id = c.id
    `;
    const result = await pool.query(query);
    res.status(200).json({ status: "success", data: { applications: result.rows } });
  } catch (err) {
    next(err);
  }
};

const getApplicationById = async (req, res, next) => {
  try {
    const cacheKey = `applications:${req.params.id}`;
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      res.set("X-Data-Source", "cache");
      return res.status(200).json({ status: "success", data: JSON.parse(cachedData) });
    }

    const query = `SELECT applications.*, users.name, users.email, jobs.title AS job_title
                   FROM applications
                   JOIN users ON applications.user_id = users.id
                   JOIN jobs ON applications.job_id = jobs.id
                   WHERE applications.id = $1`;
    const result = await pool.query(query, [req.params.id]);

    if (result.rows.length === 0) throw new NotFoundError("Lamaran tidak ditemukan");

    await redisClient.setEx(cacheKey, 3600, JSON.stringify(result.rows[0]));

    res.set("X-Data-Source", "database");
    res.status(200).json({
      status: "success",
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

const getApplicationsByUser = async (req, res, next) => {
  try {
    const cacheKey = `applications:user:${req.params.userId}`;
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      res.set("X-Data-Source", "cache");
      return res.status(200).json({ status: "success", data: JSON.parse(cachedData) });
    }

    const query = "SELECT * FROM applications WHERE user_id = $1";
    const result = await pool.query(query, [req.params.userId]);

    await redisClient.setEx(cacheKey, 3600, JSON.stringify({ applications: result.rows }));

    res.set("X-Data-Source", "database");
    res.status(200).json({
      status: "success",
      data: { applications: result.rows },
    });
  } catch (err) {
    next(err);
  }
};

const getApplicationsByJob = async (req, res, next) => {
  try {
    const jobId = req.params.jobId;

    const cacheKey = `applications:job:${jobId}`;
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      res.set("X-Data-Source", "cache");
      return res.status(200).json({ status: "success", data: JSON.parse(cachedData) });
    }

    const query = "SELECT * FROM applications WHERE job_id = $1";
    const result = await pool.query(query, [jobId]);

    await redisClient.setEx(cacheKey, 3600, JSON.stringify({ applications: result.rows }));

    res.set("X-Data-Source", "database");
    res.status(200).json({
      status: "success",
      data: { applications: result.rows },
    });
  } catch (err) {
    next(err);
  }
};

const updateApplicationStatus = async (req, res, next) => {
  try {
    const existing = await pool.query("SELECT id, user_id, job_id FROM applications WHERE id = $1", [req.params.id]);

    if (existing.rows.length === 0) {
      throw new NotFoundError("Lamaran tidak ditemukan");
    }

    const { error } = ApplicationStatusSchema.validate(req.body);
    if (error) throw error;

    const { status } = req.body;

    await pool.query("UPDATE applications SET status = $1 WHERE id = $2 ", [status, req.params.id]);

    const { user_id, job_id } = existing.rows[0];
    await redisClient.del(`applications:${req.params.id}`);
    await redisClient.del(`applications:user:${user_id}`);
    await redisClient.del(`applications:job:${job_id}`);
    res.status(200).json({
      status: "success",
      message: "Status lamaran berhasil diperbarui",
    });
  } catch (err) {
    next(err);
  }
};

const deleteApplication = async (req, res, next) => {
  try {
    const existing = await pool.query("SELECT id, user_id, job_id FROM applications WHERE id = $1", [req.params.id]);

    if (existing.rows.length === 0) {
      throw new NotFoundError("Lamaran tidak ditemukan");
    }

    await pool.query("DELETE FROM applications WHERE id = $1", [req.params.id]);

    const { user_id, job_id } = existing.rows[0];
    await redisClient.del(`applications:${req.params.id}`);
    await redisClient.del(`applications:user:${user_id}`);
    await redisClient.del(`applications:job:${job_id}`);

    res.status(200).json({
      status: "success",
      message: "Lamaran berhasil dihapus",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { applyJob, getAllApplications, getApplicationById, getApplicationsByUser, getApplicationsByJob, updateApplicationStatus, deleteApplication };
