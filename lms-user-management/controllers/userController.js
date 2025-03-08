const User = require("../models/User");
exports.updateProfile = async (req, res) => {
  try {
    const userData = { ...req.body };
    if (req.user.role === "instructor") {
      delete userData.learningHistory; 
    }
    const user = await User.findByIdAndUpdate(req.user.id, userData, { new: true }).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message})
    }
  };

  exports.getProfile = async (req, res) => {
    try {
      const userId = req.user.id; 
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }
      const responseUser = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ...(user.role === 'student' && { learningHistory: user.learningHistory }) // Include learningHistory only for students
      };
      res.json(responseUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.deleteUser = async (req, res) => {
    try {
      const { userId } = req.params; 
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ msg: "User not found" });
      await User.findByIdAndDelete(userId);
      res.json({ msg: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };