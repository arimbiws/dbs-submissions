const crypto = require("crypto");
const pool = require("../config/db");
const NotFoundError = require("../exceptions/NotFoundError");
const { ApplicationSchema, ApplicationStatusSchema } = require("../validations/schemas");

const applyJob = async (req, res, next) => {
  try {
    const { error } = ApplicationSchema.validate(req.body);
    if (error) throw error;

    const { job_id } = req.body;
    const user_id = req.user.id;
    const id = `app-${crypto.randomUUID()}`;
    const status = "pending";

    const query = "INSERT INTO applications (id, user_id, job_id, status) VALUES ($1, $2, $3, $4) RETURNING id";
    const result = await pool.query(query, [id, user_id, job_id, status]);

    res.status(201).json({
      status: "success",
      message: "Berhasil melamar pekerjaan",
      data: { id: result.rows[0].id },
    });
  } catch (err) {
    next(err);
  }
};

const getAllApplications = async (req, res, next) => {
  try {
    const query = `SELECT applications.id, applications.status, users.name AS applicant_name, jobs.title AS job_title
                   FROM applications
                   JOIN users ON applications.user_id = users.id
                   JOIN jobs ON applications.job_id = jobs.id`;
    const result = await pool.query(query);
    res.status(200).json({
      status: "success",
      data: { applications: result.rows },
    });
  } catch (err) {
    next(err);
  }
};

const getApplicationById = async (req, res, next) => {
  try {
    const query = `SELECT applications.id, applications.status, users.name, users.email, jobs.title AS job_title
                   FROM applications
                   JOIN users ON applications.user_id = users.id
                   JOIN jobs ON applications.job_id = jobs.id
                   WHERE applications.id = $1`;
    const result = await pool.query(query, [req.params.id]);

    if (result.rows.length === 0) throw new NotFoundError("Lamaran tidak ditemukan");
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
    const query = "SELECT * FROM applications WHERE user_id = $1";
    const result = await pool.query(query, [req.params.userId]);
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
    const query = "SELECT * FROM applications WHERE job_id = $1";
    const result = await pool.query(query, [req.params.job_id]);
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
    const existing = await pool.query("SELECT id FROM applications WHERE id = $1", [req.params.id]);

    if (existing.rows.length === 0) {
      throw new NotFoundError("Lamaran tidak ditemukan");
    }

    const { error } = ApplicationStatusSchema.validate(req.body);
    if (error) throw error;

    const { status } = req.body;

    await pool.query("UPDATE applications SET status = $1 WHERE id = $2 ", [status, req.params.id]);

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
    const existing = await pool.query("SELECT id FROM applications WHERE id = $1", [req.params.id]);

    if (existing.rows.length === 0) {
      throw new NotFoundError("Lamaran tidak ditemukan");
    }

    await pool.query("DELETE FROM applications WHERE id = $1", [req.params.id]);

    res.status(200).json({
      status: "success",
      message: "Lamaran berhasil dihapus",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { applyJob, getAllApplications, getApplicationById, getApplicationsByUser, getApplicationsByJob, updateApplicationStatus, deleteApplication };
