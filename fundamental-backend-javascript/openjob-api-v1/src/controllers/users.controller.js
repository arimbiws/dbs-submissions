const bcrypt = require("bcrypt");
const crypto = require("crypto");
const pool = require("../config/db");
const NotFoundError = require("../exceptions/NotFoundError");
const ClientError = require("../exceptions/ClientError");
const { UserRegisterSchema } = require("../validations/schemas");

const registerUser = async (req, res, next) => {
  try {
    const { error } = UserRegisterSchema.validate(req.body);
    if (error) throw error;

    const { name, email, password } = req.body;

    const checkEmail = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (checkEmail.rows.length > 0) {
      throw new ClientError("Email sudah digunakan.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = `user-${crypto.randomUUID()}`;

    const query = {
      text: "INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3, $4) RETURNING id",
      values: [id, name, email, hashedPassword],
    };

    const result = await pool.query(query);

    res.status(201).json({
      status: "success",
      message: "User berhasil didaftarkan",
      data: { id: result.rows[0].id },
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = {
      text: "SELECT id, name, email FROM users WHERE id = $1",
      values: [id],
    };
    const result = await pool.query(query);

    if (result.rows.length === 0) throw new NotFoundError("User tidak ditemukan");

    res.status(200).json({
      status: "success",
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { registerUser, getUserById };
