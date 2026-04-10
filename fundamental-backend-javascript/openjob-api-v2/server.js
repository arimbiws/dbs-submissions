require("dotenv").config();
const express = require("express");
const routes = require("./src/routes");
const errorHandler = require("./src/middlewares/errorHandler");

const app = express();

app.use((req, res, next) => {
  if (req.method === "POST" && !req.headers["content-type"]) {
    req.headers["content-type"] = "application/json";
  }
  next();
});

app.use(express.json());

app.use("/", routes);
app.use("/uploads", express.static("uploads"));

app.use((req, res) => {
  res.status(404).json({
    status: "failed",
    message: "Route tidak ditemukan",
  });
});

app.use(errorHandler);

const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

app.listen(port, host, () => {
  console.log(`Server berjalan pada http://${host}:${port}`);
});
