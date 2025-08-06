import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "./candidate/Dashboard";
import { motion, AnimatePresence } from "framer-motion";

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleProtectedRoute = (path) => {
    if (token) {
      navigate(path);
    } else {
      alert("⚠️ Please login to access this feature.");
    }
  };

  const actions = [
    {
      title: "Create a Quiz",
      description:
        "Craft personalized quizzes to challenge friends, students, or anyone. Bring your ideas to life and start building now.",
      onClick: () => handleProtectedRoute("/createquiz"),
    },
    {
      title: "Take a Quiz",
      description:
        "Dive into an ever-growing collection of quizzes created by others. Challenge your knowledge and learn something new every time.",
      onClick: () => navigate("/quizs"),
    },
    {
      title: "View My Results",
      description:
        "Easily track your performance across all quizzes. Analyze your scores and progress over time to stay ahead.",
      onClick: () => handleProtectedRoute("/QuizsHistory"),
    },
    {
      title: "Manage My Quizzes",
      description:
        "Edit, update, or delete your existing quizzes anytime. Maintain control and keep your content up-to-date.",
      onClick: () => handleProtectedRoute("/myquizzes"),
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % actions.length);
    }, 5000); // every 5 seconds

    return () => clearInterval(interval);
  }, [actions.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-purple-300 to-purple-400 p-6 ">
      <div className="mt-14 w-full flex justify-center items-center min-h-[380px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7 }}
            onClick={actions[currentIndex].onClick}
            className="w-full max-w-6xl cursor-pointer bg-white hover:bg-purple-200 rounded-3xl px-12 py-16 shadow-xl transition-all duration-300 text-center"
          >
            <h3 className="text-4xl font-extrabold text-purple-900 mb-6">
              {actions[currentIndex].title}
            </h3>
            <p className="text-xl text-purple-800 leading-relaxed max-w-3xl mx-auto">
              {actions[currentIndex].description}
            </p>
            <p className="mt-6 text-md text-purple-700 italic">
              (Click anywhere on the card to proceed)
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
      <Dashboard />
      <div className="flex flex-col items-center">
        {/* Static info block */}
        <div className="mt-16 max-w-5xl text-center text-purple-900 px-4">
          <h3 className="text-3xl font-bold mb-4">Why Choose QuizzyBee? 🐝</h3>
          <p className="text-lg leading-relaxed">
            Whether you're a student preparing for exams, a teacher creating
            practice tests, or a curious learner exploring new topics —
            QuizzyBee is your companion. Design, share, attempt, and analyze
            quizzes effortlessly in one beautiful platform.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;