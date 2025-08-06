import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../Context/Auth/AuthContext";

export default function ResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { stars, fetchStars } = useContext(AuthContext);
  const { result, answers,percentage, questions,starsEarned, title } = location.state || {};
  
  useEffect(() => {
    fetchStars();
    // eslint-disable-next-line
  }, []);

  const [showSummary, setShowSummary] = useState(false);

  if (!location.state) {
    return (
      <div className="text-center mt-20 text-xl text-red-600">
        No result data available. Please take the quiz.
      </div>
    );
  }
  const token = localStorage.getItem("token");

  // 🔒 Unauthorized access
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-100">
        <h2 className="text-2xl font-bold text-red-600">Unauthorized Access</h2>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br bg-purple-100 p-4 md:p-8">
      {/* Top-right corner stars */}
      <div className="flex mt-14 justify-end mb-4 mr-4">
        <div className="bg-yellow-400 text-white font-bold px-5 py-2 rounded-xl shadow-lg text-sm md:text-lg">
          ⭐ {stars}
        </div>
      </div>

      {/* Result Card */}
      <div className="max-w-4xl mt-14 mx-auto bg-purple-50 rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-2">
          Quiz Results
        </h1>

        {/* Quiz Title */}
        <h2 className="text-xl font-semibold text-center text-gray-600 mb-6">
          {title}
        </h2>

        <div className="space-y-5 text-lg text-center">
          <div>
            <span className="font-medium text-gray-700">Score:</span>{" "}
            <span className="text-green-600 font-bold">{result}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Percentage:</span>{" "}
            <span className="text-indigo-600 font-bold">{percentage}%</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Stars Earned:</span>{" "}
            <span className="text-yellow-500 font-bold">⭐ {starsEarned}</span>
          </div>
        </div>

        {/* Buttons Row */}
        <div className="mt-6 flex justify-between items-center">
          {Array.isArray(questions) &&
          questions.length > 0 &&
          Array.isArray(answers) &&
          answers.length > 0 ? (
            <button
              onClick={() => setShowSummary(!showSummary)}
              className="px-5 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium shadow"
            >
              {showSummary ? "Hide Summary" : "Show Summary"}
            </button>
          ) : (
            <div className="text-gray-500 font-medium italic">
              Summary not available
            </div>
          )}

          <button
            onClick={() => navigate("/quizs")}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium shadow"
          >
            Quiz
          </button>
        </div>

        {/* Answer Summary */}
        {showSummary &&
          Array.isArray(questions) &&
          questions.length > 0 &&
          Array.isArray(answers) &&
          answers.length > 0 && (
            <div className="mt-6 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {questions.map((q, index) => {
                const userAnswerIndex = answers[index];
                const userAnswer =
                  userAnswerIndex !== null && userAnswerIndex !== undefined
                    ? q.options[userAnswerIndex]
                    : "No Answer";

                const correctAnswer = Array.isArray(q.answer)
                  ? q.answer[0]
                  : q.answer;
                const isCorrect = userAnswer === correctAnswer;

                return (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border ${
                      isCorrect
                        ? "border-green-300 bg-green-50"
                        : "border-red-300 bg-red-50"
                    }`}
                  >
                    <div className="font-medium mb-1">
                      Q{index + 1}: {q.question}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold">Your Answer:</span>{" "}
                      <span
                        className={
                          isCorrect ? "text-green-600" : "text-red-600"
                        }
                      >
                        {userAnswer}
                      </span>
                    </div>
                    <div className="text-sm text-gray-700">
                      <span className="font-semibold">Correct Answer:</span>{" "}
                      {correctAnswer}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {q.description}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
      </div>
    </div>
  );
}
