import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import QuestionContext from "../Context/Questioncontext/QuestionContext";
import AuthContext from "../Context/Auth/AuthContext";
import ResultContext from "../Context/Resultcontext/ResultContext";

export default function QuizPage() {
  const { getQuestions, questions } = useContext(QuestionContext);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
   const { createResult } = useContext(ResultContext);
   const { fetchCurrentUser, user, addStars} = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { quiz_id, password,title } = location.state || {};

  // Fetch questions
  useEffect(() => {
    getQuestions(quiz_id, password);
  }, [quiz_id, password, getQuestions]);

  // Initialize answers once
  useEffect(() => {
    if (questions && questions.length > 0 && answers.length === 0) {
      setAnswers(Array(questions.length).fill(null));
    }
  }, [questions, answers.length]);
  useEffect(()=>{
    fetchCurrentUser();
  },[])
  // Handle empty state
  if (!questions || questions.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold text-red-600">
          Sorry, something went wrong. No questions found.
        </p>
      </div>
    );
  }

  const total = questions.length;
  const rawQuestion = questions[currentQ];

  // Dynamically find the correct index from the "answer" field
  const correctIndex = rawQuestion.options.indexOf(rawQuestion.answer[0]);
  const q = { ...rawQuestion, correctIndex };

  const selected = answers[currentQ];

  const handleOptionClick = (idx) => {
    if (selected !== null) return; // lock after selection
    const updatedAnswers = [...answers];
    updatedAnswers[currentQ] = idx;
    setAnswers(updatedAnswers);
  };

  const goNext = () => {
    if (currentQ < total - 1) setCurrentQ(currentQ + 1);
  };

  const goPrevious = () => {
    if (currentQ > 0) setCurrentQ(currentQ - 1);
  };

  const submitQuiz = async () => {
    const yourScore = answers.reduce((score, selectedIdx, i) => {
      const question = questions[i];
      if (!question) return score; // 🛡️ skip undefined question

      const correct = question.options.indexOf(question.answer[0]);
      return selectedIdx === correct ? score + 1 : score;
    }, 0);

    const percentage = Math.round((yourScore / total) * 100);
    const result = `${yourScore}/${questions.length}`;
    const starsEarned = yourScore * 2;
    // Destructure user details
    const { name, profession, institution } = user || {};
    
   await createResult(
     quiz_id,
     name,
     title,
     profession,
     institution,
     yourScore, // just the value
     total,
     percentage, // just the value
     starsEarned
   );

    // Update stars in backend
    await addStars(starsEarned);

    // Navigate to result page
    navigate("/result", {
      state: {
        quiz_id,
        result,
        answers,
        questions,
        starsEarned,
        percentage,
        title,
      },
    });
  };
  const progressPercent = Math.round(((currentQ + 1) / total) * 100);
  const showDescription = selected !== null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 to-indigo-100 flex flex-col items-center py-10 px-4">
      <div className="w-full mt-14 max-w-4xl">
        {/* Title */}
        <h1 className="text-4xl font-bold text-indigo-800 mb-10 text-center">
          {title}
        </h1>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-indigo-700">
              Question {currentQ + 1} / {total}
            </span>
            <span className="text-sm text-indigo-700">{progressPercent}%</span>
          </div>
          <div className="w-full bg-indigo-200 rounded-full h-3">
            <div
              className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white shadow-lg rounded-3xl p-8">
          <h2 className="text-2xl font-semibold mb-6 text-indigo-800">
            Q{currentQ + 1}. {q.question}
          </h2>

          {/* Options */}
          <div className="grid gap-4">
            {q.options.map((option, idx) => {
              let bg = "bg-violet-100 hover:bg-violet-200";
              if (selected !== null) {
                if (idx === q.correctIndex) bg = "bg-emerald-300";
                else if (idx === selected) bg = "bg-red-400 text-white";
                else bg = "bg-gray-100";
              }

              return (
                <div
                  key={idx}
                  onClick={() => handleOptionClick(idx)}
                  className={`text-lg px-5 py-4 rounded-xl cursor-pointer transition-colors ${bg}`}
                >
                  {option}
                </div>
              );
            })}
          </div>

          {/* Explanation */}
          {showDescription && q.description && (
            <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-md text-blue-800 text-md">
              {q.description}
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            <button
              onClick={goPrevious}
              disabled={currentQ === 0}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-medium disabled:opacity-50"
            >
              Previous
            </button>

            {currentQ === total - 1 ? (
              <button
                onClick={submitQuiz}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium"
              >
                Submit
              </button>
            ) : (
              <button
                onClick={goNext}
                className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
