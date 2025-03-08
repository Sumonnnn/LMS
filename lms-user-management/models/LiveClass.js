const mongoose = require("mongoose");

const LiveClassSchema = new mongoose.Schema({
  title: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  scheduledTime: { type: Date, required: true },
  link: { type: String, required: true },  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("LiveClass", LiveClassSchema);




