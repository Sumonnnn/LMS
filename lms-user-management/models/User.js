const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "instructor", "admin"], default: "student" },
  learningHistory: [{ courseId: String, completed: Boolean }],
  lastLogin: { type: Date },
  enrolledCourses: [{ courseId: String, status: { type: String, enum: ["enrolled", "dropped"], default: "enrolled" } }],
  isVerified: { type: Boolean, default: false }, 
  verificationToken: { type: String }
});

module.exports = mongoose.model("User", UserSchema);



