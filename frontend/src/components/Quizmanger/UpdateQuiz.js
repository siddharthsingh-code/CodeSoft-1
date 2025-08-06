import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QuizContext from "../../Context/Quizcontext/QuizContext";

const UpdateQuiz = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { updateQuiz } = useContext(QuizContext);

  const [quiz, setQuiz] = useState({
    title: "",
    password: "",
    active: true,
    description: "",
  });

  useEffect(() => {
    if (state) {
      setQuiz({
        title: state.title || "",
        password: state.password || "",
        description: state.description || "",
        active: state.status?.toLowerCase() === "active", // normalize status
        _id: state._id,
      });
    }
  }, [state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuiz((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleStatus = () => {
    setQuiz((prev) => ({
      ...prev,
      active: !prev.active,
    }));
  };

  const handleUpdate = () => {
    if (!quiz.title) {
      alert("Please fill in all required fields.");
      return;
    }

    updateQuiz(quiz._id, {
      title: quiz.title,
      password: quiz.password,
      description: quiz.description,
      status: quiz.active ? "active" : "inactive",
    });

    alert("✅ Quiz updated successfully!");
    navigate("/myquizzes");
  };

  const handleCancel = () => {
    navigate("/myquizzes");
  };
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
    <div className="min-h-screen bg-purple-100 px-6 py-10 flex justify-center items-center">
      <div className="bg-purple-50 rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-center mb-6 text-purple-800">
          Update Quiz
        </h2>

        <div className="space-y-5">
          <div>
            <label className="block font-semibold mb-1 text-gray-700">
              Quiz Title
            </label>
            <input
              type="text"
              name="title"
              value={quiz.title}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-gray-700">
              Password
            </label>
            <input
              type="text"
              name="password"
              value={quiz.password}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={quiz.description}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center">
              <span className="font-semibold text-gray-700 mr-2">Status:</span>
              <span
                className={`text-sm font-semibold ${
                  quiz.active ? "text-green-700" : "text-red-600"
                }`}
              >
                {quiz.active ? "Active" : "Inactive"}
              </span>
            </div>
            <div
              className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer ${
                quiz.active ? "bg-green-500" : "bg-gray-400"
              }`}
              onClick={toggleStatus}
            >
              <div
                className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ease-in-out ${
                  quiz.active ? "translate-x-6" : ""
                }`}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={handleCancel}
              className="w-full bg-gray-400 text-white py-3 rounded-xl font-semibold hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700"
            >
              Update Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateQuiz;
