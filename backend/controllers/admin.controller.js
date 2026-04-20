const bcrypt = require("bcryptjs");
const User = require("../models/User"); // ✅ THIS WAS MISSING

exports.createUser = async (req, res) => {
  try {
const { name, rollNo, password, role, subjectAssignments, year, section } = req.body;
    const exists = await User.findOne({ rollNo });
    if (exists) {
      return res.status(400).json({
        error: "Roll number already exists"
      });
    }

    // hash password
    const hash = await bcrypt.hash(password, 10);

    // create user
    await User.create({
  name,
  rollNo,
  password: hash,
  role,
  year: role === "student" ? year : undefined,
  section: role === "student" ? section : undefined,
  subjectAssignments: role === "student" ? subjectAssignments : [],
  subjects: req.body.subjects || []
});

    res.json({ success: true });

  } catch (err) {
    console.error("CREATE USER ERROR:", err);
    res.status(500).json({
      error: "Server error"
    });
  }
};

exports.getTeachers = async (req, res) => {
  try {
    const teachers = await User.find(
      { role: "teacher" },
      { password: 0 }
    );
    res.json(teachers);
  } catch {
    res.status(500).json({ error: "Failed to fetch teachers" });
  }
};
