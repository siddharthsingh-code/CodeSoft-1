const mongoose = require("mongoose");
const { Schema } = mongoose;

const QuestionSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  quiz_id: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: function (arr) {
        return arr.length >= 2;
      },
      message: "At least two options are required",
    },
  },
  answer: {
    type: [String],
    required: true,
    validate: {
      validator: function (vals) {
        return vals.every((val) => this.options.includes(val));
      },
      message: "Each answer must be one of the options",
    },
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
QuestionSchema.index({ quiz_id: 1, question: 1 }, { unique: true });
const Question = mongoose.model("Question", QuestionSchema);
module.exports = Question;
