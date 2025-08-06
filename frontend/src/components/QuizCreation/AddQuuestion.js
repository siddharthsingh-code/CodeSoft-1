import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QuestionContext from "../../Context/Questioncontext/QuestionContext";

const AddQuestions = () => {
  const { addQuestion } = useContext(QuestionContext);
  const location = useLocation();
  const navigate = useNavigate();

  const { _id, title } = location.state || {};

  const [questionForms, setQuestionForms] = useState([
    {
      questionText: "",
      description: "",
      options: ["", "", "", ""],
      correctIndex: 0,
      isActive: true,
    },
  ]);

const token = localStorage.getItem("token");

// 🔒 Unauthorized access
if (!token) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-100">
      <h2 className="text-2xl font-bold text-red-600">Unauthorized Access</h2>
    </div>
  );
}
 
  const handleFieldChange = (index, field, value) => {
    const updated = [...questionForms];
    updated[index][field] = value;
    setQuestionForms(updated);
  };

  const handleOptionChange = (formIndex, optIndex, value) => {
    const updated = [...questionForms];
    updated[formIndex].options[optIndex] = value;
    setQuestionForms(updated);
  };

  const handleCorrectIndexChange = (formIndex, value) => {
    const updated = [...questionForms];
    updated[formIndex].correctIndex = value;
    setQuestionForms(updated);
  };

  const validateQuestion = (q) => {
    return (
      q.questionText.trim() &&
      q.description.trim() &&
      q.options.every((opt) => opt.trim())
    );
  };

  const handleAddMore = () => {
    const activeIndex = questionForms.findIndex((q) => q.isActive);
    const activeQuestion = questionForms[activeIndex];

    if (!validateQuestion(activeQuestion)) {
      alert("Please complete the current question before proceeding.");
      return;
    }

    const { questionText, description, options, correctIndex } = activeQuestion;
    const correctAnswer = options[correctIndex];
    addQuestion(_id, questionText, description, options, correctAnswer);

    const updated = questionForms.map((q, i) =>
      i === activeIndex ? { ...q, isActive: false } : q
    );

    setQuestionForms([
      ...updated,
      {
        questionText: "",
        description: "",
        options: ["", "", "", ""],
        correctIndex: 0,
        isActive: true,
      },
    ]);
  };

  const handleFinalSubmit = () => {
    const activeQuestion = questionForms.find((q) => q.isActive);

    if (!validateQuestion(activeQuestion)) {
      alert("Please complete the current question before submitting.");
      return;
    }

    const { questionText, description, options, correctIndex } = activeQuestion;
    const correctAnswer = options[correctIndex];

    addQuestion(_id, questionText, description, options, correctAnswer);

    alert("All questions submitted successfully!");
    navigate("/quizs");
  };

  return (
    <div className="min-h-screen bg-purple-100 p-6">
      <div className="max-w-5xl mt-14 mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-purple-900">
          Add Questions to: {title}
        </h2>
        <p className="text-purple-700 font-medium">Quiz ID: {_id}</p>

        {questionForms.map((q, idx) => (
          <div
            key={idx}
            className={`bg-white p-6 rounded-xl shadow ${
              q.isActive ? "" : "opacity-50 pointer-events-none"
            }`}
          >
            <h3 className="font-bold text-lg mb-2 text-purple-800">
              Question {idx + 1}
            </h3>
            <input
              type="text"
              className="w-full border rounded-xl mb-2 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter question"
              value={q.questionText}
              onChange={(e) =>
                handleFieldChange(idx, "questionText", e.target.value)
              }
              disabled={!q.isActive}
            />

            <textarea
              placeholder="Enter description"
              className="w-full border rounded-xl mb-2 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={q.description}
              onChange={(e) =>
                handleFieldChange(idx, "description", e.target.value)
              }
              disabled={!q.isActive}
            />

            {q.options.map((opt, i) => (
              <div key={i} className="flex gap-2 items-center mb-2">
                <input
                  type="text"
                  className="w-full border rounded-xl mb-2 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={`Option ${i + 1}`}
                  value={opt}
                  onChange={(e) => handleOptionChange(idx, i, e.target.value)}
                  disabled={!q.isActive}
                />
                <input
                  type="radio"
                  name={`correct-${idx}`}
                  checked={q.correctIndex === i}
                  onChange={() => handleCorrectIndexChange(idx, i)}
                  disabled={!q.isActive}
                />
                <label className="text-sm">Correct</label>
              </div>
            ))}
          </div>
        ))}

        <div className="flex gap-4 justify-between mt-6">
          <button
            onClick={handleAddMore}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-semibold"
          >
            Submit & Next Question
          </button>

          <button
            onClick={handleFinalSubmit}
            className="bg-purple-800 hover:bg-purple-900 text-white px-4 py-2 rounded font-semibold"
          >
            Submit Final & Finish
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddQuestions;
