const Lecture = require("../models/Lecture");
const Module = require("../models/Module");
const Quiz = require("../models/Quiz");
const Forum = require("../models/Forum");
const LiveClass = require("../models/LiveClass");

exports.uploadLecture = async (req, res) => {
  try {
    console.log("Request Data:", req.body);
    
    const { title, description, fileUrl, moduleId } = req.body;
    if (!title || !fileUrl || !moduleId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newLecture = new Lecture({ title, description, fileUrl, module: moduleId, instructor: req.user.id });
    await newLecture.save();

    res.status(201).json({ message: "Lecture uploaded successfully" });
  } catch (error) {
    console.error("Upload Lecture Error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.createModule = async (req, res) => {
  try {
    console.log("Creating Module:", req.body);

    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Module name is required" });
    }

    const newModule = new Module({ name, description, instructor: req.user.id });
    await newModule.save();
    
    res.status(201).json(newModule);
  } catch (error) {
    console.error("Create Module Error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.createQuiz = async (req, res) => {
  try {
    console.log("Creating Quiz:", req.body);

    const { moduleId, questions } = req.body;
    if (!moduleId || !questions || questions.length === 0) {
      return res.status(400).json({ error: "Module ID and questions are required" });
    }

    const newQuiz = new Quiz({ module: moduleId, questions, createdBy: req.user.id });
    await newQuiz.save();
    
    res.status(201).json(newQuiz);
  } catch (error) {
    console.error("Create Quiz Error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.postForumMessage = async (req, res) => {
  try {
    console.log("Posting Forum Message:", req.body);

    const { moduleId, message } = req.body;
    if (!moduleId || !message) {
      return res.status(400).json({ error: "Module ID and message are required" });
    }

    const newForumMessage = new Forum({ module: moduleId, user: req.user.id, message });
    await newForumMessage.save();

    res.status(201).json(newForumMessage);
  } catch (error) {
    console.error("Post Forum Message Error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.scheduleLiveClass = async (req, res) => {
  try {
    console.log("Scheduling Live Class:", req.body);

    const { title, scheduledTime, link } = req.body;
    if (!title || !scheduledTime || !link) {
      return res.status(400).json({ error: "Title, scheduled time, and link are required" });
    }

    const newLiveClass = new LiveClass({ title, scheduledTime, link, instructor: req.user.id });
    await newLiveClass.save();
    
    res.status(201).json(newLiveClass);
  } catch (error) {
    console.error("Schedule Live Class Error:", error);
    res.status(500).json({ error: error.message });
  }
};


