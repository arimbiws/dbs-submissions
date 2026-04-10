const crypto = require("crypto");
const pool = require("../config/db");
const NotFoundError = require("../exceptions/NotFoundError");
const { CompanySchema } = require("../validations/schemas");
const redisClient = require("../services/redis.service");

const createCompany = async (req, res, next) => {
  try {
    const { error } = CompanySchema.validate(req.body);
    if (error) throw error;

    const { name, location, description } = req.body;
    const id = `company-${crypto.randomUUID()}`;

    const result = await pool.query("INSERT INTO companies (id, name, location, description) VALUES ($1, $2, $3, $4) RETURNING id", [id, name, location, description]);

    res.status(201).json({
      status: "success",
      message: "Company berhasil ditambahkan",
      data: { id: result.rows[0].id },
    });
  } catch (err) {
    next(err);
  }
};

const getAllCompanies = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM companies");

    res.status(200).json({
      status: "success",
      data: { companies: result.rows },
    });
  } catch (err) {
    next(err);
  }
};

const getCompanyById = async (req, res, next) => {
  try {
    const cacheKey = `companies:${req.params.id}`;

    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      res.set("X-Data-Source", "cache");
      return res.status(200).json({ status: "success", data: JSON.parse(cachedData) });
    }

    const result = await pool.query("SELECT id, name, location, description FROM companies WHERE id = $1", [req.params.id]);

    if (result.rows.length === 0) throw new NotFoundError("Company tidak ditemukan");

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

const updateCompany = async (req, res, next) => {
  try {
    const exist = await pool.query("SELECT id FROM companies WHERE id = $1", [req.params.id]);

    if (exist.rows.length === 0) {
      throw new NotFoundError("Company tidak ditemukan");
    }

    const { error } = CompanySchema.validate(req.body);
    if (error) throw error;

    const { name, location, description } = req.body;

    await pool.query("UPDATE companies SET name = $1, location = $2, description = $3 WHERE id = $4 RETURNING id", [name, location, description, req.params.id]);

    await redisClient.del(`companies:${req.params.id}`);

    res.status(200).json({
      status: "success",
      message: "Company berhasil diperbarui",
    });
  } catch (err) {
    next(err);
  }
};

const deleteCompany = async (req, res, next) => {
  try {
    const existing = await pool.query("SELECT id FROM companies WHERE id = $1", [req.params.id]);

    if (existing.rows.length === 0) {
      throw new NotFoundError("Company tidak ditemukan");
    }

    await pool.query("DELETE FROM companies WHERE id = $1", [req.params.id]);

    await redisClient.del(`companies:${req.params.id}`);

    res.status(200).json({
      status: "success",
      message: "Company berhasil dihapus",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { createCompany, getAllCompanies, getCompanyById, updateCompany, deleteCompany };
