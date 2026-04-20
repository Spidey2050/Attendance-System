const router = require("express").Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });


const { protect, teacherOnly } = require("../middleware/auth");
const {
  verifyStudent,
  getAllStudents,
  sendNotification,
  submitAttendance,
  getNotifications ,
  deleteNotification 
} = require("../controllers/teacher.controller");
// ===============================
// GET ALL STUDENTS (Teacher)
// ===============================
router.get(
  "/students",
  protect,
  teacherOnly,
  getAllStudents
);

// ===============================
// VERIFY STUDENT FACE
// ===============================
router.post(
  "/verify-student",
  protect,
  teacherOnly,
  upload.single("image"),
  verifyStudent
);

router.post(
  "/notify",
  protect,
  teacherOnly,
  sendNotification
);

router.post("/submit-attendance", protect, teacherOnly, submitAttendance);

router.get("/notifications", protect, teacherOnly, getNotifications);

router.delete("/notifications/:id", protect, teacherOnly, deleteNotification);

module.exports = router;
