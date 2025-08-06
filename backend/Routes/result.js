const express = require("express");
const router = express.Router();
const fetchUser = require("../middleware/fetchuser");
const Result = require("../Models/Result");
const Quiz = require("../Models/Quiz");
// ✅ Create Result - POST /api/result/create
router.post("/create", fetchUser, async (req, res) => {
  try {
    const {
      quiz_id,
      name,
      title,
      profession,
      institution,
      score,
      total,
      percentage,
      starsEarned,
    } = req.body;

    const result = new Result({
      user_id: req.user.id,
      quiz_id,
      name,
      title,
      profession,
      institution,
      score,
      total,
      percentage,
      starsEarned,
    });

    await result.save();
    res.status(201).json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error saving result");
  }
});

// ✅ Get My Results - GET /api/result/my
router.get("/my", fetchUser, async (req, res) => {
  try {
    const results = await Result.find({ user_id: req.user.id })
      .select("quiz_id title score total percentage starsEarned")
      .sort({ date: -1 });

    const formatted = results.map((r) => ({
      quizId: r.quiz_id,
      title: r.title,
      score: `${r.score} / ${r.total}`,
      percentage: `${r.percentage}`,
      stars: `(${r.starsEarned})`,
      id:r._id,
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/myresult/:quiz_id", fetchUser, async (req, res) => {
   try {
     const result = await Result.findOne({
       quiz_id: req.params.quiz_id,
       user_id: req.user.id,
     }).select("name profession institution score total percentage date");

     if (!result) {
       return res.status(404).json({ error: "Result not found for this quiz" });
     }

     const formattedResult = {
       quizId: result.quiz_id,
      title: r.title,
      score: `${result.score} / ${result.total}`,
      percentage: `${result.percentage}%`,
      stars: `(${result.starsEarned})`,
      id:result._id,
       date: result.date,
     };

     res.json(formattedResult);
   } catch (err) {
     console.error(err.message);
     res.status(500).send("Server Error");
   }
 });



router.get("/quiz/:quiz_id", fetchUser, async (req, res) => {
  try {
    
    const quiz = await Quiz.findById(req.params.quiz_id);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }


    if (quiz.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }


    const results = await Result.find({ quiz_id: req.params.quiz_id })
      .select("name profession institution score total percentage")
      .sort({ date: -1 });


    const formatted = results.map((r) => ({
      name: r.name,
      profession: r.profession,
      institution: r.institution,
      score: `${r.score} / ${r.total}`,
      percentage: `${r.percentage}%`,
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});



router.get("/stats", fetchUser, async (req, res) => {
  try {
    const results = await Result.find({ user_id: req.user.id }).sort({ date: -1 });

    if (results.length === 0) {
      return res.json({
        totalTests: 0,
        totalStars: 0,
        averageScore: 0,
        highestScore: 0,
        scoreProgress: [],
      });
    }

    const totalTests = results.length;
    const totalStars = results.reduce((sum, r) => sum + (r.starsEarned || 0), 0);
    const totalScore = results.reduce((sum, r) => sum + r.percentage, 0);
    const averageScore = Math.round(totalScore / totalTests);
    const highestScore = Math.max(...results.map(r => r.percentage));
    const scoreProgress = results.map((r, i) => ({
      name: r.title,
      score: r.percentage,
    })).reverse(); 

    res.json({
      totalTests,
      totalStars,
      averageScore,
      highestScore,
      scoreProgress,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
module.exports = router;
