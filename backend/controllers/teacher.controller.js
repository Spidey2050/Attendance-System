const User = require("../models/User");
const axios = require("axios");
const FormData = require("form-data");
const Notification = require("../models/Notification");

let attendanceMap = {};

// ===============================
// VERIFY STUDENT FACE
// ===============================
exports.verifyStudent = async (req, res) => {
  try {
    const { rollNo , subject, year, section } = req.body;
    const file = req.file;

    const teacher = await User.findById(req.user.id);

if (!teacher.subjects || !teacher.subjects.includes(subject)) {
  return res.status(403).json({
    error: "You are not allowed to teach this subject"
  });
}

    if (!rollNo || !file) {
      return res.status(400).json({
        error: "rollNo and image are required"
      });
    }

    // 🔒 CRITICAL SAFETY CHECK 
    if (!file.buffer || file.buffer.length < 5000) {
      return res.status(400).json({
        error: "Invalid image captured. Please try again."
      });
    }

    // find student

const student = await User.findOne({
  rollNo,
  role: "student",
  year: year,           
  section: section,  
  subjectAssignments: {
    $elemMatch: {
      teacher: req.user.id,
      subject: subject
    }
  }
});


if (!student) {
  return res.status(403).json({
    error: "You are not allowed to access this student"
  });
}

    if (!student || !student.embedding?.length) {
      return res.status(404).json({
        error: "Student face not enrolled"
      });
    }

    // send image bytes to python
    // send image to python as multipart/form-data
const formData = new FormData();
formData.append("file", file.buffer, {
  filename: "image.jpg",
  contentType: file.mimetype
});

const embedRes = await axios.post(
  "http://127.0.0.1:8000/embed",
  formData,
  {
    headers: formData.getHeaders(),
    timeout: 15000
  }
);


    if (!embedRes.data || !embedRes.data.embedding) {
      throw new Error("Embedding failed");
    }

    const liveEmbedding = embedRes.data.embedding;

    // compare embeddings
    const compareRes = await axios.post(
      "http://127.0.0.1:8000/compare",
      {
        stored: student.embedding,
        live: liveEmbedding
      }
    );
    // ✅ STORE PRESENT STUDENTS (TEMP)
if (compareRes.data.match) {
  if (!attendanceMap[req.user.id]) {
    attendanceMap[req.user.id] = new Set();
  }

  attendanceMap[req.user.id].add(rollNo);
}
    res.json({
      match: compareRes.data.match,
      distance: compareRes.data.distance
    });

  } catch (err) {
    console.error("VERIFY STUDENT ERROR:", err.response?.data || err.message);
    res.status(500).json({
      error: "Verification failed"
    });
  }
};

// ===============================
// GET ALL STUDENTS
// ===============================
exports.getAllStudents = async (req, res) => {
  try {
    const { subject, year, section } = req.query;   // ✅ FIX

    const students = await User.find(
      { 
        role: "student",
        year: year,           // 🔥 ADD
        section: section,   
        subjectAssignments: {
          $elemMatch: {
            teacher: req.user.id,
            subject: subject
          }
        }
      },
      { password: 0, embedding: 0 }
    );

    res.json(students);

  } catch (err) {
    console.error("GET STUDENTS ERROR:", err.message);
    res.status(500).json({
      error: "Failed to fetch students"
    });
  }
};
// ===============================
// SEND NOTIFICATION (Teacher)
// ===============================

exports.sendNotification = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    // 🔥 Get teacher name
    const teacher = await User.findById(req.user.id);

    const notif = await Notification.create({
  message,
  senderName: teacher.name,
  senderId: req.user.id   // 🔥 IMPORTANT
});

    res.json({ success: true, notif });

  } catch (err) {
    res.status(500).json({ error: "Failed to send notification" });
  }
};

exports.submitAttendance = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { subject, year, section } = req.body;
    const teacher = await User.findById(req.user.id);

    if (!teacher.subjects || !teacher.subjects.includes(subject)) {
  return res.status(403).json({
    error: "Not allowed for this subject"
  });
}


    const students = await User.find({
      role: "student",
      year: year,           
      section: section,
      subjectAssignments: {
        $elemMatch: {
          teacher: teacherId,
          subject: subject
        }
      }
    });

    const presentSet = attendanceMap[teacherId] || new Set();

    for (let student of students) {
      
      if (!student.attendance[subject]) {
  student.attendance[subject] = { present: 0, total: 0 };
}

student.attendance[subject].total += 1;

if (presentSet.has(student.rollNo)) {
  student.attendance[subject].present += 1;
}

      await student.save();
    }

    attendanceMap[teacherId] = new Set();

    console.log("Present Set:", presentSet);
    console.log("Students:", students.map(s => s.rollNo));

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: "Failed to submit attendance" });
  }
};

exports.getNotifications = async (req, res) => {
  const notifications = await Notification.find().sort({ createdAt: -1 });
  res.json(notifications);
};

exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notif = await Notification.findById(id);

    if (!notif) {
      return res.status(404).json({ error: "Notification not found" });
    }

    // 🔒 OWNER CHECK
    if (notif.senderId.toString() !== req.user.id) {
      return res.status(403).json({
        error: "You can only delete your own notification"
      });
    }

    await Notification.findByIdAndDelete(id);

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
};