const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

exports.login = async (req, res) => {
  const { rollNo, password } = req.body;

  const user = await User.findOne({ rollNo });
  if (!user) return res.status(404).json({ error: "User not found" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: "Wrong password" });

  res.json({
    token: generateToken(user),
    role: user.role,
    user: {
    _id: user._id,
    name: user.name
  }
  });
};
