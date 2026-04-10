const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/auth.middleware");
const appsController = require("../controllers/applications.controller");

router.post("/", verifyToken, appsController.applyJob);
router.get("/", verifyToken, appsController.getAllApplications);
router.get("/:id", verifyToken, appsController.getApplicationById);

router.get("/user/:userId", verifyToken, appsController.getApplicationsByUser);
router.get("/job/:jobId", verifyToken, appsController.getApplicationsByJob);

router.put("/:id", verifyToken, appsController.updateApplicationStatus);
router.delete("/:id", verifyToken, appsController.deleteApplication);

module.exports = router;
