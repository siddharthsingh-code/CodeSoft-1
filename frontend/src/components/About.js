import React from "react";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300 px-6 py-16">
      <div className="max-w-5xl mt-14 mx-auto bg-white/70 backdrop-blur-md p-10 rounded-3xl shadow-lg">
        <h1 className="text-5xl font-extrabold text-purple-800 text-center mb-8 tracking-wide">
          About <span className="text-purple-600">QuizzyBee 🐝</span>
        </h1>

        <p className="text-lg text-gray-800 mb-6 leading-relaxed">
          Welcome to{" "}
          <span className="font-semibold text-purple-600">QuizzyBee</span> –
          your ultimate platform for creating, taking, and sharing engaging
          quizzes. Whether you're a curious learner or a passionate teacher,
          QuizzyBee makes quiz-building fun, fast, and impactful.
        </p>

        <p className="text-lg text-gray-800 mb-6 leading-relaxed">
          Designed for all – students, educators, and enthusiasts – QuizzyBee
          helps you explore knowledge, challenge others, and track performance
          effortlessly. Join us in making learning an enjoyable journey!
        </p>

        <h2 className="text-3xl font-bold text-purple-700 mt-10 mb-4">
          🔍 Key Features
        </h2>
        <ul className="list-disc list-inside space-y-3 text-gray-800 text-lg">
          <li>🧠 Create your own quizzes with multiple-choice questions</li>
          <li>🔒 Join quizzes using secure quiz IDs and passwords</li>
          <li>📊 View detailed performance reports and results</li>
          <li>📱 Mobile-friendly and responsive interface</li>
          <li>⚡ Instant scoring with smart feedback</li>
        </ul>

        <h2 className="text-3xl font-bold text-purple-700 mt-10 mb-4">
          🎯 Our Mission
        </h2>
        <p className="text-lg text-gray-800 mb-6 leading-relaxed">
          We believe learning should be interactive, fun, and accessible to
          everyone. Our mission is to empower students, educators, and lifelong
          learners with the tools they need to grow smarter through quizzes —
          anytime, anywhere.
        </p>

        <p className="text-lg text-gray-800 leading-relaxed">
          💬 Got feedback or questions? Don’t hesitate to connect with us — we’d
          love to hear from you and continue improving your quiz experience!
        </p>
      </div>
    </div>
  );
}
