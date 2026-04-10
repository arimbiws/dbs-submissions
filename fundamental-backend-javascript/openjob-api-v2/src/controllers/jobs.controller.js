const crypto = require("crypto");
const pool = require("../config/db");
const NotFoundError = require("../exceptions/NotFoundError");
const { JobSchema } = require("../validations/schemas");

const createJob = async (req, res, next) => {
  try {
    const { error } = JobSchema.validate(req.body);
    if (error) throw error;

    const recruiter_id = req.user.id;
    const { title, description, company_id, category_id } = req.body;
    const id = `job-${crypto.randomUUID()}`;

    const query = {
      text: "INSERT INTO jobs (id, title, description, company_id, category_id, recruiter_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
      values: [id, title, description, company_id, category_id, recruiter_id],
    };

    const result = await pool.query(query);

    res.status(201).json({
      status: "success",
      message: "Job berhasil ditambahkan",
      data: { id: result.rows[0].id },
    });
  } catch (err) {
    next(err);
  }
};

const getAllJobs = async (req, res, next) => {
  try {
    const { title, "company-name": companyName } = req.query;

    let queryText = `
      SELECT jobs.id, jobs.title, jobs.description, jobs.job_type, jobs.experience_level, 
             jobs.location_type, jobs.location_city, jobs.salary_min, jobs.salary_max, 
             jobs.is_salary_visible, jobs.status, companies.name AS company_name, categories.name AS category_name
      FROM jobs
      JOIN companies ON jobs.company_id = companies.id
      JOIN categories ON jobs.category_id = categories.id
      WHERE 1=1
    `;
    const queryValues = [];
    let queryCount = 1;

    if (title) {
      queryText += ` AND jobs.title ILIKE $${queryCount}`;
      queryValues.push(`%${title}%`);
      queryCount++;
    }

    if (companyName) {
      queryText += ` AND companies.name ILIKE $${queryCount}`;
      queryValues.push(`%${companyName}%`);
      queryCount++;
    }

    const result = await pool.query(queryText, queryValues);
    res.status(200).json({
      status: "success",
      data: { jobs: result.rows },
    });
  } catch (err) {
    next(err);
  }
};

const getJobById = async (req, res, next) => {
  try {
    const query = {
      text: `SELECT jobs.id, jobs.title, jobs.description, companies.name AS company_name, categories.name AS category_name
             FROM jobs
             JOIN companies ON jobs.company_id = companies.id
             JOIN categories ON jobs.category_id = categories.id
             WHERE jobs.id = $1`,
      values: [req.params.id],
    };
    const result = await pool.query(query);
    if (result.rows.length === 0) throw new NotFoundError("Job tidak ditemukan");

    res.status(200).json({
      status: "success",
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

const getJobsByCompany = async (req, res, next) => {
  try {
    const query = "SELECT * FROM jobs WHERE company_id = $1";
    const result = await pool.query(query, [req.params.company_id]);
    res.status(200).json({
      status: "success",
      data: { jobs: result.rows },
    });
  } catch (err) {
    next(err);
  }
};

const getJobsByCategory = async (req, res, next) => {
  try {
    const query = "SELECT * FROM jobs WHERE category_id = $1";
    const result = await pool.query(query, [req.params.category_id]);
    res.status(200).json({
      status: "success",
      data: { jobs: result.rows },
    });
  } catch (err) {
    next(err);
  }
};

const updateJob = async (req, res, next) => {
  try {
    const existing = await pool.query("SELECT * FROM jobs WHERE id = $1", [req.params.id]);

    if (existing.rows.length === 0) {
      throw new NotFoundError("Job tidak ditemukan");
    }

    const { error } = JobSchema.validate(req.body);
    if (error) throw error;

    const { title, description, company_id, category_id } = req.body;

    const updatedTitle = title || existing.rows[0].title;
    const updatedDescription = description || existing.rows[0].description;
    const updatedCompanyId = company_id || existing.rows[0].company_id;
    const updatedCategoryId = category_id || existing.rows[0].category_id;

    await pool.query("UPDATE jobs SET title = $1, description = $2, company_id = $3, category_id = $4 WHERE id = $5", [updatedTitle, updatedDescription, updatedCompanyId, updatedCategoryId, req.params.id]);

    res.status(200).json({
      status: "success",
      message: "Job berhasil diperbarui",
    });
  } catch (err) {
    next(err);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    const existing = await pool.query("SELECT id FROM jobs WHERE id = $1", [req.params.id]);

    if (existing.rows.length === 0) {
      throw new NotFoundError("Job tidak ditemukan");
    }

    await pool.query("DELETE FROM jobs WHERE id = $1", [req.params.id]);

    res.status(200).json({
      status: "success",
      message: "Job berhasil dihapus",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { createJob, getAllJobs, getJobById, getJobsByCompany, getJobsByCategory, updateJob, deleteJob };
