const mongoose = require("mongoose");
const { Schema } = mongoose;

const QuizSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: false, 
  },
  description: {
    type: String,
    required: false, 
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
QuizSchema.index({ title: 1, password: 1 }, { unique: true });
const Quiz = mongoose.model("Quiz", QuizSchema);
module.exports = Quiz;
