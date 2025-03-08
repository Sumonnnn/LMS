const express = require("express");
const router = express.Router();
const contentController = require("../controllers/contentController"); 
const { auth, instructorAuth } = require("../middleware/authMiddleware");

router.post("/upload", auth, instructorAuth, contentController.uploadLecture);
router.post("/module", auth, instructorAuth, contentController.createModule);
router.post("/quiz", auth, instructorAuth, contentController.createQuiz);
router.post("/forum", auth, contentController.postForumMessage);
router.post("/live", auth, instructorAuth, contentController.scheduleLiveClass);


module.exports = router;


