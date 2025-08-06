import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import QuizContext from "../../Context/Quizcontext/QuizContext";

const CreateQuiz = () => {
  const { createQuiz } = useContext(QuizContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // 🔒 Unauthorized access
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-100">
        <h2 className="text-2xl font-bold text-red-600">Unauthorized Access</h2>
      </div>
    );
  }

  const handleNext = async () => {
    if (!title.trim()) {
      alert("Please enter a quiz title");
      return;
    }

    const quizData = {
      title,
      description,
      status,
      password,
    };

    const newQuiz = await createQuiz(quizData);

    if (newQuiz?._id) {
      alert("Quiz created successfully!");
      navigate(`/addQuestion/${newQuiz._id}`, { state: newQuiz });
    } else {
      alert("Quiz creation failed!");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-purple-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6">
        <h2 className="text-3xl font-bold text-center text-purple-700">
          Create New Quiz
        </h2>

        <div>
          <label className="block font-semibold text-purple-800 mb-1">
            Quiz Title
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter quiz title"
          />
        </div>

        <div>
          <label className="block font-semibold text-purple-800 mb-1">
            Description
          </label>
          <textarea
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter quiz description"
          />
        </div>

        <div>
          <label className="block font-semibold text-purple-800 mb-1">
            Status
          </label>
          <select
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-purple-800 mb-1">
            Password (Optional)
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </div>

        <button
          onClick={handleNext}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-xl font-semibold transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CreateQuiz;
