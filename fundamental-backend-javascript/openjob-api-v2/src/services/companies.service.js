const pool = require("../config/db");
const crypto = require("crypto");
const redisClient = require("./redis.service");
const NotFoundError = require("../exceptions/NotFoundError");

const addCompany = async (payload) => {
  const { name, location, description } = payload;
  const id = `company-${crypto.randomUUID()}`;
  const result = await pool.query("INSERT INTO companies (id, name, location, description) VALUES ($1, $2, $3, $4) RETURNING id", [id, name, location, description]);
  return result.rows[0].id;
};

const getCompanies = async () => {
  // PENGGANTI SELECT *
  const result = await pool.query("SELECT id, name, location, description FROM companies");
  return result.rows;
};

module.exports = { addCompany, getCompanies };
