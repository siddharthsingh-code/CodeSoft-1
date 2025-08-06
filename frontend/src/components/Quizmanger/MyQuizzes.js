import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import QuizContext from "../../Context/Quizcontext/QuizContext";
import QuestionContext from "../../Context/Questioncontext/QuestionContext";

const MyQuizzes = () => {
  const { myQuizzes, fetchMyQuizzes, deleteQuiz } = useContext(QuizContext);
  const { deleteAllQuestions } = useContext(QuestionContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (token) {
      fetchMyQuizzes();
    }
    // eslint-disable-next-line
  }, []);

  const handleCreateQuiz = () => {
    navigate("/createquiz");
  };

  const handleViewParticipants = (quiz) => {
    navigate(`/view-participants/${quiz._id}`, { state: quiz });
  };

  const handleViewQuestions = (quiz) => {
    navigate(`/view/${quiz._id}`, { state: quiz });
  };

  const handleUpdateQuiz = (quiz) => {
    navigate(`/update/${quiz._id}`, { state: quiz });
  };

  const handleDeleteQuiz = (quiz) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the quiz "${quiz.title}"?`
    );
    if (confirmDelete) {
      deleteQuiz(quiz._id);
      deleteAllQuestions(quiz._id);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-100">
        <h2 className="text-2xl font-bold text-white">Unauthorized Access</h2>
      </div>
    );
  }

  const filteredQuizzes = myQuizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz._id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      <div className="max-w-screen  min-h-screen bg-purple-100 shadow-2xl p-8">
        <div className="flex mt-14 items-center justify-between mb-6">
          <h2 className="text-3xl  font-bold text-gray-800">
            My Posted Quizzes
          </h2>
          <button
            onClick={handleCreateQuiz}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-xl font-semibold transition"
          >
            + Create Quiz
          </button>
        </div>

        {/* Search Input */}
        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or quiz ID..."
            className="w-full sm:w-1/2 px-4 py-2 border border-purple-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/*  Filtered Quizzes */}
        {filteredQuizzes.length === 0 ? (
          <p className="text-center text-gray-600">
            No quizzes found. Try a different search.
          </p>
        ) : (
          <ul className="space-y-4">
            {filteredQuizzes.map((quiz) => (
              <li
                key={quiz._id}
                className="border p-5 rounded-xl bg-purple-50 hover:shadow transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {quiz.title}
                    </h3>
                    <p className="text-md text-gray-500 mb-1">
                      {quiz.description}
                    </p>
                    <p className="text-sm text-gray-500">ID: {quiz._id}</p>
                    <p className="text-sm text-gray-500">
                      Password:{" "}
                      <span className="font-mono">
                        {quiz.password || "None"}
                      </span>
                    </p>
                    <p className="text-sm mt-1">
                      Status:{" "}
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          quiz.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {quiz.status}
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-2 sm:mt-0">
                    <button
                      onClick={() => handleViewParticipants(quiz)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      View Participants
                    </button>
                    <button
                      onClick={() => handleViewQuestions(quiz)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      View Questions
                    </button>
                    <button
                      onClick={() => handleUpdateQuiz(quiz)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      Update Quiz
                    </button>
                    <button
                      onClick={() => handleDeleteQuiz(quiz)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      Delete Quiz
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyQuizzes;
