const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const { UserLoginSchema } = require("../validations/schemas");
const TokenManager = require("../utils/tokenManager");
const AuthenticationError = require("../exceptions/AuthenticationError");
const ClientError = require("../exceptions/ClientError");

const login = async (req, res, next) => {
  try {
    const { error } = UserLoginSchema.validate(req.body);
    if (error) throw error;

    const { email, password } = req.body;

    const userResult = await pool.query("SELECT id, password FROM users WHERE email = $1", [email]);
    if (userResult.rows.length === 0) throw new AuthenticationError("Kredensial yang Anda berikan salah");

    const user = userResult.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new AuthenticationError("Kredensial yang Anda berikan salah");

    const payload = { id: user.id };
    const accessToken = TokenManager.generateAccessToken(payload);
    const refreshToken = TokenManager.generateRefreshToken(payload);

    await pool.query("INSERT INTO authentications (token) VALUES ($1)", [refreshToken]);

    res.status(200).json({
      status: "success",
      data: { accessToken, refreshToken },
    });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) throw new ClientError("Refresh token tidak ditemukan");

    const checkToken = await pool.query("SELECT token FROM authentications WHERE token = $1", [refreshToken]);
    if (checkToken.rows.length === 0) throw new ClientError("Refresh token tidak valid di database");

    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
      const accessToken = TokenManager.generateAccessToken({ id: decoded.id });

      res.status(200).json({
        status: "success",
        message: "Access Token berhasil diperbarui",
        data: { accessToken },
      });
    } catch (err) {
      throw new ClientError("Refresh token kadaluarsa atau tidak valid");
    }
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) throw new ClientError("Refresh token tidak ditemukan");

    const checkToken = await pool.query("SELECT token FROM authentications WHERE token = $1", [refreshToken]);
    if (checkToken.rows.length === 0) throw new ClientError("Refresh token tidak valid di database");

    await pool.query("DELETE FROM authentications WHERE token = $1", [refreshToken]);

    res.status(200).json({
      status: "success",
      message: "Refresh token berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, refreshToken, logout };
