const express = require("express");
const router = express.Router();
const Quiz = require("../Models/Quiz");
const fetchuser = require("../middleware/fetchuser");


router.get("/allQuiz", async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

router.get("/myquizzes", fetchuser, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ user: req.user.id });
    res.json(quizzes);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});


router.post("/create", fetchuser, async (req, res) => {
  const { title, password, status, description } = req.body;

  try {
  
    const allowedStatus = ["active", "inactive"];
    if (status && !allowedStatus.includes(status)) {
      return res.status(400).json({ error: "Invalid status. Must be 'active' or 'inactive'." });
    }

    const quiz = new Quiz({
      user: req.user.id,
      title,
      password,
      status,
      description, 
    });

    await quiz.save();
    res.status(201).json(quiz);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error creating quiz");
  }
});


router.put("/update/:id", fetchuser, async (req, res) => {
  const { title, password, status, description } = req.body;

  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ msg: "Quiz not found" });

    if (quiz.user.toString() !== req.user.id)
      return res.status(403).json({ msg: "Unauthorized" });

    quiz.title = title || quiz.title;
    quiz.password = password || quiz.password;
    quiz.status = status || quiz.status;
    quiz.description = description || quiz.description;
    await quiz.save();
    res.json(quiz);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error updating quiz");
  }
});


router.delete("/delete/:id", fetchuser, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ msg: "Quiz not found" });

    if (quiz.user.toString() !== req.user.id)
      return res.status(403).json({ msg: "Unauthorized" });

    await quiz.deleteOne();
    res.json({ msg: "Quiz deleted", quiz });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error deleting quiz");
  }
});

module.exports = router;
