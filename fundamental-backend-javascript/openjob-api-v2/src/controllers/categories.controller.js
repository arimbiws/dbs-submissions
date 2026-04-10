const crypto = require("crypto");
const pool = require("../config/db");
const NotFoundError = require("../exceptions/NotFoundError");
const { CategorySchema } = require("../validations/schemas");

const createCategory = async (req, res, next) => {
  try {
    const { error } = CategorySchema.validate(req.body);
    if (error) throw error;

    const { name } = req.body;
    const id = `category-${crypto.randomUUID()}`;

    const result = await pool.query("INSERT INTO categories (id, name) VALUES ($1, $2) RETURNING id", [id, name]);

    res.status(201).json({
      status: "success",
      message: "Category berhasil ditambahkan",
      data: { id: result.rows[0].id },
    });
  } catch (err) {
    next(err);
  }
};

const getAllCategories = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM categories");
    res.status(200).json({
      status: "success",
      data: { categories: result.rows },
    });
  } catch (err) {
    next(err);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT id, name FROM categories WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) throw new NotFoundError("Category tidak ditemukan");
    res.status(200).json({
      status: "success",
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const existing = await pool.query("SELECT id FROM categories WHERE id = $1", [req.params.id]);

    if (existing.rows.length === 0) {
      throw new NotFoundError("Category tidak ditemukan");
    }

    const { error } = CategorySchema.validate(req.body);
    if (error) throw error;

    const { name } = req.body;

    await pool.query("UPDATE categories SET name = $1 WHERE id = $2", [name, req.params.id]);

    res.status(200).json({
      status: "success",
      message: "Category berhasil diperbarui",
    });
  } catch (err) {
    next(err);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const existing = await pool.query("SELECT id FROM categories WHERE id = $1", [req.params.id]);

    if (existing.rows.length === 0) {
      throw new NotFoundError("Category tidak ditemukan");
    }

    await pool.query("DELETE FROM categories WHERE id = $1", [req.params.id]);

    res.status(200).json({
      status: "success",
      message: "Category berhasil dihapus",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory };
