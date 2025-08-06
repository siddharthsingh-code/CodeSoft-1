const mongoose = require("mongoose");
const { Schema } = mongoose;

const ResultSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  quiz_id: {
    type: String,
    ref: "Quiz",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  profession: {
    type: String,
    required: true,
  },
  institution: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
  starsEarned: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
ResultSchema.index({ quiz_id: 1, user_id: 1 }, { unique: true });
const Result = mongoose.model("Result", ResultSchema);
module.exports = Result;
