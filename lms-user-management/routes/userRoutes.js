const express = require("express");
const { updateProfile, getProfile, deleteUser } = require("../controllers/userController");
const { auth, adminAuth } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);
router.delete("/:userId", auth, adminAuth, deleteUser);

module.exports = router;
