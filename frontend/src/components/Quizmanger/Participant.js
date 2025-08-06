import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ResultContext from "../../Context/Resultcontext/ResultContext";
const ViewParticipants = () => {
  const location = useLocation();
  const { getResultsByQuizId, quizResults } = useContext(ResultContext);
  const navigate = useNavigate();
  const quiz = location.state || { title: "Untitled Quiz", _id: "UnknownID" };


  useEffect(() => {
    getResultsByQuizId(quiz._id);
  }, []);
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
    <div className="min-h-screen bg-purple-100 px-6 py-10">
      <div className="max-w-5xl mt-14 mx-auto bg-purple-50 shadow-xl rounded-2xl p-8 relative">
        {/* Back Arrow */}
        <button
          onClick={() => navigate("/myquizzes")}
          className="absolute top-5 left-5 text-gray-700 hover:text-black flex items-center gap-1"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>

        <div className="mb-8 text-center mt-4">
          <h1 className="text-3xl font-bold text-purple-800 mb-1">
            {quiz.title}
          </h1>
          <p className="text-gray-600 text-sm">Quiz ID: {quiz._id}</p>
        </div>

        {quizResults.length === 0 ? (
          <p className="text-center text-gray-500">
            No participants available.
          </p>
        ) : (
          <div className="space-y-6">
            {quizResults.map((p, idx) => {
              const percentage = ((p.score / p.total) * 100).toFixed(0);
              return (
                <div
                  key={idx}
                  className="border border-gray-300 rounded-xl p-5 bg-gray-50 shadow-sm"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {p.name}
                  </h3>
                  <p className="text-gray-600">Profession: {p.profession}</p>
                  <p className="text-gray-600">Institution: {p.institution}</p>
                  <p className="text-gray-700 mt-2">
                    <strong>Score:</strong> {p.score}
                  </p>
                  <p className="text-blue-600 font-medium">
                    <strong>Percentage:</strong> {p.percentage}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewParticipants;
