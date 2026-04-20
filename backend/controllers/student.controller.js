const User = require("../models/User");
const { getEmbedding } = require("../utils/python");
const Notification = require("../models/Notification");


exports.enrollFace = async (req, res) => {
  const { rollNo } = req.body;

  const student = await User.findOne({ rollNo, role: "student" });
  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }

  let embeddings = [];

  for (const file of req.files) {
    const emb = await getEmbedding(file.buffer);
    embeddings.push(emb);
  }

  // average embeddings
  const avg = embeddings[0].map((_, i) =>
    embeddings.reduce((sum, e) => sum + e[i], 0) / embeddings.length
  );

  student.embedding = avg;
  await student.save();

  res.json({ success: true });
};


// ===============================
// GET NOTIFICATIONS
// ===============================
exports.getNotifications = async (req, res) => {
  try {
    const data = await Notification.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const subjects = ["Math","Physics","Chemistry","English","Computer","Biology"];

    let totalPresent = 0;
    let totalClasses = 0;

    const subjectData = subjects.map(sub => {
      const data = user.attendance?.[sub] || { present: 0, total: 0 };

      totalPresent += data.present;
      totalClasses += data.total;

      return {
        subject: sub,
        present: data.present,
        total: data.total,
        percent: data.total === 0
          ? 0
          : ((data.present / data.total) * 100).toFixed(1)
      };
    });

    const overall = totalClasses === 0
      ? 0
      : ((totalPresent / totalClasses) * 100).toFixed(1);

    res.json({
      overall,
      totalPresent,
      totalClasses,
      subjectData
    });

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
};