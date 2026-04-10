const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/auth.middleware");
const uploadMiddleware = require("../middlewares/upload.middleware");
const documentsController = require("../controllers/documents.controller");

router.get("/", documentsController.getAllDocuments);
router.get("/:id", documentsController.getDocumentById);
router.post("/", verifyToken, uploadMiddleware.single("document"), documentsController.uploadDocument);
router.delete("/:id", verifyToken, documentsController.deleteDocument);

module.exports = router;
