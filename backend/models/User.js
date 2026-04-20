const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  rollNo: { type: String, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "teacher", "student"],
    required: true
  },
  year: {
  type: String,
  enum: ["1st", "2nd", "3rd", "4th"]
},

section: {
  type: String,
  enum: ["A", "B", "C"]
},

  embedding: [Number],

  attendance: {
    Math: { present: { type: Number, default: 0 }, total: { type: Number, default: 0 } },
    Physics: { present: { type: Number, default: 0 }, total: { type: Number, default: 0 } },
    Chemistry: { present: { type: Number, default: 0 }, total: { type: Number, default: 0 } },
    English: { present: { type: Number, default: 0 }, total: { type: Number, default: 0 } },
    Computer: { present: { type: Number, default: 0 }, total: { type: Number, default: 0 } },
    Biology: { present: { type: Number, default: 0 }, total: { type: Number, default: 0 } }
  },

  subjectAssignments: [
    {
      subject: {
        type: String,
        enum: ["Math", "Physics", "Chemistry", "English", "Computer", "Biology"]
      },
      teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    }
  ],

  // 🔥 ADD THIS FOR TEACHERS
  subjects: [
    {
      type: String,
      enum: ["Math", "Physics", "Chemistry", "English", "Computer", "Biology"]
    }
  ]

});

module.exports = mongoose.model("User", userSchema);