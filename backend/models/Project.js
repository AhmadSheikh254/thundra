const mongoose = require('mongoose');

const SceneSchema = new mongoose.Schema({
  id: Number,
  timeStart: Number,
  timeEnd: Number,
  text: String,
  brollSuggestion: String,
  mediaUrl: String
});

const CaptionSchema = new mongoose.Schema({
  id: Number,
  timeStart: Number,
  timeEnd: Number,
  text: String
});

const ProjectSchema = new mongoose.Schema({
  prompt: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  musicStyle: String,
  scenes: [SceneSchema],
  captions: [CaptionSchema],
  broll: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Project', ProjectSchema);
