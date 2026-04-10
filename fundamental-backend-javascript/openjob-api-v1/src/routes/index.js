const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/auth.middleware");

const usersController = require("../controllers/users.controller");
const authController = require("../controllers/auth.controller");
const profileController = require("../controllers/profile.controller");
const bookmarksController = require("../controllers/bookmarks.controller");

const jobsRoutes = require("./jobs.routes");
const documentsRoutes = require("./documents.routes");
const applicationsRoutes = require("./applications.routes");
const companiesRoutes = require("./companies.routes");
const categoriesRoutes = require("./categories.routes");

router.post("/users", usersController.registerUser);
router.get("/users/:id", usersController.getUserById);
router.post("/authentications", authController.login);
router.put("/authentications", authController.refreshToken);
router.delete("/authentications", verifyToken, authController.logout);
router.get("/profile", verifyToken, profileController.getProfile);
router.get("/profile/applications", verifyToken, profileController.getMyApplications);
router.get("/profile/bookmarks", verifyToken, profileController.getMyBookmarks);

router.get("/bookmarks", verifyToken, bookmarksController.getAllBookmarks);

router.use("/jobs", jobsRoutes);
router.use("/documents", documentsRoutes);
router.use("/applications", applicationsRoutes);
router.use("/companies", companiesRoutes);
router.use("/categories", categoriesRoutes);

module.exports = router;
