const express = require("express");
const router = express.Router();
const Quiz = require("../Models/Quiz");
const Question = require("../Models/Questions");
const fetchUser = require("../middleware/fetchuser");
// ✅ Get all questions for a quiz

router.post("/create", fetchUser, async (req, res) => {
  try {
    const { quiz_id, question, options, answer, description } = req.body;

    // Basic validation
    if (!quiz_id || !question || !options || !answer || !description) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newQuestion = new Question({
      user: req.user.id,
      quiz_id,
      question,
      options,
      answer,
      description,
    });

    const savedQuestion = await newQuestion.save();
    res.status(201).json(savedQuestion);
  } catch (err) {
    console.error("Error creating question:", err.message);
    res.status(500).send("Server Error");
  }
});




router.post("/quiz/:quiz_id", fetchUser, async (req, res) => {
  const { password } = req.body; // Password from request body

  try {
    const quiz = await Quiz.findById(req.params.quiz_id);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }
   
    // If quiz has a password, validate it
     if (quiz.password) {
       if (!password || quiz.password !== password) {
         return res
           .status(401)
           .json({ error: "Incorrect or missing password" });
       }
     }

    const questions = await Question.find({ quiz_id: req.params.quiz_id });
    res.json(questions);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// ✅ Get a question by ID
router.get("/:id", fetchUser, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ msg: "Question not found" });

    if (question.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "Not authorized" });

    res.json(question);
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

// ✅ Update question (question, answer, options, description)
router.put("/update/:id", fetchUser, async (req, res) => {
  const { question, answer, options, description } = req.body;

  try {
    let q = await Question.findById(req.params.id);
    if (!q) return res.status(404).json({ msg: "Question not found" });

    if (q.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "Not authorized" });

    // Update only allowed fields
    if (question) q.question = question;
    if (options) q.options = options;
    if (answer) q.answer = answer;
    if (description) q.description = description;

    await q.save();
    res.json(q);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// ✅ Delete question by ID
router.delete("/:id", fetchUser, async (req, res) => {
  try {
    const q = await Question.findById(req.params.id);
    if (!q) return res.status(404).json({ msg: "Question not found" });

    if (q.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "Not authorized" });

    await Question.findByIdAndDelete(req.params.id);
    res.json({ msg: "Question deleted successfully" });
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

// ✅ Delete all questions for a quiz ID
router.delete("/quiz/:quiz_id", fetchUser, async (req, res) => {
  try {
    const deleted = await Question.deleteMany({
      quiz_id: req.params.quiz_id,
      user: req.user.id,
    });
    res.json({
      msg: `${deleted.deletedCount} questions deleted`,
    });
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;
