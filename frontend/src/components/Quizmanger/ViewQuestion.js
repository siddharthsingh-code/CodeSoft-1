import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Pencil, Trash2, ArrowLeft } from "lucide-react";
import QuestionContext from "../../Context/Questioncontext/QuestionContext";

const ViewQuestions = () => {
  const { questions, getQuestions, updateQuestion, deleteQuestion } =
    useContext(QuestionContext);

  const location = useLocation();
  const navigate = useNavigate();
  const { _id, title, password, status } = location.state || {};

  const [formStates, setFormStates] = useState([]);

  useEffect(() => {
    if (_id) {
      getQuestions(_id, password);
    }
    // eslint-disable-next-line
  }, [_id, password]);

  useEffect(() => {
    if (Array.isArray(questions)) {
      setFormStates(
        questions.map((q) => ({
          ...q,
          options: [...q.options],
          isEditing: false,
        }))
      );
    }
  }, [questions]);

  const handleInputChange = (index, field, value) => {
    const updated = [...formStates];
    updated[index][field] = value;
    setFormStates(updated);
  };

  const handleOptionChange = (index, optIndex, value) => {
    const updated = [...formStates];
    updated[index].options[optIndex] = value;
    setFormStates(updated);
  };

  const handleEdit = (index) => {
    const updated = formStates.map((q, i) =>
      i === index ? { ...q, isEditing: true } : q
    );
    setFormStates(updated);
  };

  const handleCancel = (index) => {
    const updated = [...formStates];
    updated[index] = {
      ...questions[index],
      options: [...questions[index].options],
      isEditing: false,
    };
    setFormStates(updated);
  };

  const handleUpdate = async (index) => {
    const q = formStates[index];
    await updateQuestion(q._id, q);
    const updated = [...formStates];
    updated[index].isEditing = false;
    setFormStates(updated);
  };

  const handleDelete = async (question) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      await deleteQuestion(question._id);
    }
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
    <div className="min-h-screen bg-purple-100 px-6 py-10">
      <div className="max-w-5xl mt-14 mx-auto bg-purple-50 shadow-xl rounded-2xl p-8 relative">
        <button
          onClick={() => navigate("/myquizzes")}
          className="absolute top-6 left-6 text-gray-600 hover:text-black flex items-center"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mt-4 text-purple-800 mb-2">
            {title}
          </h1>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Quiz ID:</strong> {_id}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Status:</strong> {status}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Password:</strong> {password}
          </p>
        </div>

        {formStates.length === 0 ? (
          <p className="text-center text-gray-600">No questions added yet.</p>
        ) : (
          <ul className="space-y-6">
            {formStates.map((q, idx) => (
              <li
                key={q._id}
                className={`border rounded-xl p-6 shadow-sm relative ${
                  q.isEditing ? "bg-yellow-50 border-yellow-400" : "bg-gray-50"
                }`}
              >
                <div className="space-y-2">
                  <label className="block text-sm font-semibold">
                    Question {idx + 1}
                  </label>
                  <input
                    type="text"
                    value={q.question}
                    disabled={!q.isEditing}
                    onChange={(e) =>
                      handleInputChange(idx, "question", e.target.value)
                    }
                    className="w-full p-2 border rounded-lg"
                  />

                  <label className="block text-sm font-medium text-gray-600">
                    Description
                  </label>
                  <input
                    type="text"
                    value={q.description}
                    disabled={!q.isEditing}
                    onChange={(e) =>
                      handleInputChange(idx, "description", e.target.value)
                    }
                    className="w-full p-2 border rounded-lg"
                  />

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Options:
                    </label>
                    {q.options.map((opt, i) => (
                      <div key={i} className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold">
                          {String.fromCharCode(65 + i)}:
                        </span>
                        <input
                          type="text"
                          value={opt}
                          disabled={!q.isEditing}
                          onChange={(e) =>
                            handleOptionChange(idx, i, e.target.value)
                          }
                          className="flex-1 p-2 border rounded-lg"
                        />
                      </div>
                    ))}
                  </div>

                  <label className="block text-sm font-medium">Answer</label>
                  <input
                    type="text"
                    value={q.answer}
                    disabled={!q.isEditing}
                    onChange={(e) =>
                      handleInputChange(idx, "answer", e.target.value)
                    }
                    className="w-full p-2 border rounded-lg text-green-600 font-medium"
                  />
                </div>

                {/* Action Buttons */}
                <div className="mt-4 right-4 flex justify-end gap-3">
                  {q.isEditing ? (
                    <>
                      <button
                        onClick={() => handleUpdate(idx)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleCancel(idx)}
                        className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(idx)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(q)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10 text-center">
          <button
            onClick={() =>
              navigate(`/addQuestion/${_id}`, {
                state: { _id, title, password, status },
              })
            }
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-md font-semibold"
          >
            +Add Question
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewQuestions;
