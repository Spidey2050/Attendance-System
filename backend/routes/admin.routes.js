const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middleware/auth");
const { createUser , getTeachers } = require("../controllers/admin.controller");

// Admin creates teachers & students
router.post(
  "/create-user",
  protect,
  adminOnly,
  createUser
);
router.get("/teachers", protect, adminOnly, getTeachers);

module.exports = router;
