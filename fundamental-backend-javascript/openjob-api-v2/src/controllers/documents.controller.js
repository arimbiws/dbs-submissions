const crypto = require("crypto");
const pool = require("../config/db");
const fs = require("fs");
const NotFoundError = require("../exceptions/NotFoundError");
const ClientError = require("../exceptions/ClientError");
const path = require("path");

const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) throw new ClientError("File is required. File document tidak ditemukan atau salah format");

    const id = `doc-${crypto.randomUUID()}`;
    const userId = req.user.id;
    const file_name = req.file.filename;
    const file_path = req.file.path;

    const query = "INSERT INTO documents (id, user_id, filename, path) VALUES ($1, $2, $3, $4) RETURNING id";
    const result = await pool.query(query, [id, userId, file_name, file_path]);

    res.status(201).json({
      status: "success",
      message: "Dokumen berhasil diunggah",
      data: { documentId: result.rows[0].id, filename: req.file.filename, originalName: req.file.originalname, size: req.file.size },
    });
  } catch (err) {
    next(err);
  }
};

const getAllDocuments = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM documents");
    res.status(200).json({
      status: "success",
      data: { documents: result.rows },
    });
  } catch (err) {
    next(err);
  }
};

const getDocumentById = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT filename, path FROM documents WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) throw new NotFoundError("Dokumen tidak ditemukan");

    const filePath = path.resolve(result.rows[0].path);
    if (!fs.existsSync(filePath)) throw new NotFoundError("File fisik tidak ditemukan");

    res.setHeader("Content-Disposition", `attachment; filename="${result.rows[0].filename}"`);
    res.contentType("application/pdf");
    res.sendFile(filePath);
  } catch (err) {
    next(err);
  }
};

const deleteDocument = async (req, res, next) => {
  try {
    const { id } = req.params;

    const findResult = await pool.query("SELECT path FROM documents WHERE id = $1 AND user_id = $2", [id, req.user.id]);
    if (findResult.rows.length === 0) throw new NotFoundError("Dokumen tidak ditemukan atau bukan milik Anda");

    const filePath = findResult.rows[0].path;

    await pool.query("DELETE FROM documents WHERE id = $1", [id]);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.status(200).json({
      status: "success",
      message: "Dokumen berhasil dihapus",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadDocument, getAllDocuments, getDocumentById, deleteDocument };
