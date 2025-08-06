import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QuizContext from "../Context/Quizcontext/QuizContext";
import ResultContext from "../Context/Resultcontext/ResultContext";

const QuizList = () => {
  const { fetchAllQuizzes, quizzes } = useContext(QuizContext);
  const { getMyResults, results } = useContext(ResultContext);
  const [search, setSearch] = useState("");
  const [showPasswordInput, setShowPasswordInput] = useState({});
  const [passwordInputs, setPasswordInputs] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAllQuizzes();
    getMyResults(); // fetch user's quiz results
    // eslint-disable-next-line
  }, []);

  const handlePasswordChange = (id, value) => {
    setPasswordInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleStartQuiz = (quiz) => {
    if (quiz.status !== "active") return;

    if (!quiz.password) {
      navigate(`/quiz/${quiz._id}/question`, {
        state: {
          quiz_id: quiz._id,
          password: quiz.password,
          title: quiz.title,
        },
      });
    } else {
      if (!showPasswordInput[quiz._id]) {
        setShowPasswordInput((prev) => ({ ...prev, [quiz._id]: true }));
      } else {
        const inputPassword = passwordInputs[quiz._id] || "";
        if (inputPassword === quiz.password) {
          navigate(`/quiz/${quiz._id}/question`, {
            state: {
              quiz_id: quiz._id,
              password: quiz.password,
              title: quiz.title,
            },
          });
        } else {
          alert("❌ Incorrect password!");
        }
      }
    }
  };

  const handleViewResult = (quiz, result) => {
    navigate("/result", {
      state: {
        quiz_id: quiz._id,
        result: result.score,
        starsEarned: result.stars,
        percentage: result.percentage,
        title: result.title,
      },
    });
  };

  const filteredQuizzes = quizzes?.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(search.toLowerCase()) ||
      quiz._id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-purple-100 px-4 py-6">
      <div className="flex flex-col md:flex-row mt-14 justify-between items-center max-w-7xl mx-auto mb-6 gap-4">
        <h1 className="text-3xl font-bold text-purple-800">
          Available Quizzes
        </h1>
        <input
          type="text"
          placeholder="Search by ID or Title"
          className="px-4 py-2 border border-purple-300 rounded-3xl shadow-sm w-full md:w-64 focus:outline-purple-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredQuizzes.length === 0 ? (
        <div className="text-center text-lg text-purple-600 font-medium mt-20">
          🔍 No quizzes found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {filteredQuizzes.map((quiz) => {
            const result = results.find((r) => r.quizId === quiz._id);
            const isGiven = !!result;

            return (
              <div
                key={quiz._id}
                className="relative bg-white p-6 rounded-2xl shadow-md hover:shadow-purple-300 transition flex flex-col justify-between min-h-[230px] border border-purple-200"
              >
                {/* Quiz ID at the top right */}
                <div className="absolute top-4 right-4 text-sm font-semibold text-grey-200">
                  ID: {quiz._id}
                </div>

                <div className="flex-grow">
                  <h2 className="text-xl font-semibold mt-4 text-purple-800 mb-2">
                    {quiz.title}
                  </h2>
                  <p className="text-gray-600">{quiz.description}</p>
                </div>

                <div className="mt-4">
                  {!token ? (
                    <div className="text-center text-red-500 font-medium">
                      🔒 Please login to attempt or view this quiz
                    </div>
                  ) : isGiven ? (
                    <button
                      className="w-full bg-purple-700 hover:bg-purple-900 text-white py-2 rounded-xl font-medium transition"
                      onClick={() => handleViewResult(quiz, result)}
                    >
                      View Result
                    </button>
                  ) : (
                    <>
                      {quiz.password && showPasswordInput[quiz._id] && (
                        <input
                          type="password"
                          placeholder="Enter Password"
                          className="w-full px-3 py-2 border border-purple-300 rounded-lg mb-2 focus:outline-purple-400"
                          value={passwordInputs[quiz._id] || ""}
                          onChange={(e) =>
                            handlePasswordChange(quiz._id, e.target.value)
                          }
                        />
                      )}

                      <button
                        disabled={quiz.status !== "active"}
                        className={`w-full ${
                          quiz.password ? "bg-purple-500" : "bg-green-600"
                        } text-white py-2 rounded-xl font-semibold transition ${
                          quiz.status !== "active"
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:brightness-110"
                        }`}
                        onClick={() => handleStartQuiz(quiz)}
                      >
                        Start Test
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default QuizList;
