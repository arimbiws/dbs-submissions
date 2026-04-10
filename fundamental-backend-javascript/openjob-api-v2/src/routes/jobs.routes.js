const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/auth.middleware");

const jobController = require("../controllers/jobs.controller");
const bookmarksController = require("../controllers/bookmarks.controller");

router.get("/", jobController.getAllJobs);
router.get("/company/:company_id", jobController.getJobsByCompany);
router.get("/category/:category_id", jobController.getJobsByCategory);

router.get("/:id", jobController.getJobById);

router.post("/", verifyToken, jobController.createJob);
router.put("/:id", verifyToken, jobController.updateJob);
router.delete("/:id", verifyToken, jobController.deleteJob);

router.post("/:job_id/bookmark", verifyToken, bookmarksController.createBookmark);
router.get("/:job_id/bookmark/:id", verifyToken, bookmarksController.getBookmarkDetail);
router.delete("/:job_id/bookmark", verifyToken, bookmarksController.deleteBookmark);

module.exports = router;
