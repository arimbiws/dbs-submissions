const ClientError = require("../exceptions/ClientError");

const errorHandler = (err, req, res, next) => {
  if (err instanceof ClientError) {
    return res.status(err.statusCode).json({
      status: "failed",
      message: err.message,
    });
  }

  if (err.isJoi) {
    return res.status(400).json({ status: "failed", message: err.message });
  }

  console.error("Server Error:", err);

  res.status(500).json({
    status: "error",
    message: "Terjadi kegagalan pada server kami.",
  });
};
module.exports = errorHandler;
