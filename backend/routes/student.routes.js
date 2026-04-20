const router = require("express").Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });


const { protect, adminOnly } = require("../middleware/auth");
const { enrollFace, getNotifications, getAttendance } = require("../controllers/student.controller");

router.post(
  "/enroll-face",
  protect,
  adminOnly,
  upload.array("images", 30),
  enrollFace
);
router.get(
  "/notifications",
  protect,
  getNotifications
);
router.get("/attendance", protect, getAttendance);

module.exports = router;
