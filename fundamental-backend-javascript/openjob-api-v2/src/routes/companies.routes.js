const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/auth.middleware");
const companiesController = require("../controllers/companies.controller");

router.get("/", companiesController.getAllCompanies);
router.get("/:id", companiesController.getCompanyById);

router.post("/", verifyToken, companiesController.createCompany);
router.put("/:id", verifyToken, companiesController.updateCompany);
router.delete("/:id", verifyToken, companiesController.deleteCompany);

module.exports = router;
