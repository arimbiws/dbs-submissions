const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/auth.middleware");
const categoriesController = require("../controllers/categories.controller");

router.get("/", categoriesController.getAllCategories);
router.get("/:id", categoriesController.getCategoryById);

router.post("/", verifyToken, categoriesController.createCategory);
router.put("/:id", verifyToken, categoriesController.updateCategory);
router.delete("/:id", verifyToken, categoriesController.deleteCategory);

module.exports = router;
