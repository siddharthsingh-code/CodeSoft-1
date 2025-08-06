import React, { useState } from "react";
import QuizContext from "./QuizContext";

const host = process.env.REACT_APP_HOST ;

const QuizState = ({ children }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [myQuizzes, setMyQuizzes] = useState([]);
  const Token = localStorage.getItem("token");
  // Fetch all quizzes (public)
  const fetchAllQuizzes = async () => {
    try {
      const res = await fetch(`${host}/api/quiz/allQuiz`);
      const data = await res.json();
      setQuizzes(data);
    } catch (err) {
      console.error("Error fetching all quizzes:", err);
    }
  };

  // Fetch quizzes by current user
  const fetchMyQuizzes = async () => {
    try {
      const res = await fetch(`${host}/api/quiz/myquizzes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": Token,
        },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setMyQuizzes(data);
      } else {
        console.error("Expected array but got:", data);
        setMyQuizzes([]); // fallback
      }
    } catch (err) {
      console.error("Error fetching user's quizzes:", err);
    }
  };

  // Create a new quiz
  const createQuiz = async ({ title, password, status, description }) => {
    try {
      if(!Token){
        return console.error("Login To Create Quiz");
      }
      const res = await fetch(`${host}/api/quiz/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": Token,
        },
        body: JSON.stringify({ title, password, status, description }),
      });

      const data = await res.json();

      if (res.ok) {
        setMyQuizzes((prev) => [...prev, data]);
        return data; // ✅ return newly created quiz
      } else {
        console.error("Quiz creation failed:", data.error || "Unknown error");
        return null;
      }
    } catch (err) {
      console.error("Error creating quiz:", err);
      return null;
    }
  };
  // Update a quiz
  const updateQuiz = async (id, { title, password, status, description }) => {
    try {
      const res = await fetch(`${host}/api/quiz/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": Token,
        },
        body: JSON.stringify({ title, password, status, description }),
      });

      const data = await res.json();
      if (res.ok) {
        setMyQuizzes((prev) =>
          prev.map((quiz) => (quiz._id === id ? data : quiz))
        );
      } else {
        console.error("Quiz update failed:", data.msg || "Unknown error");
      }
    } catch (err) {
      console.error("Error updating quiz:", err);
    }
  };

  // Delete a quiz
  const deleteQuiz = async (id) => {
    try {
      const res = await fetch(`${host}/api/quiz/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": Token,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setMyQuizzes((prev) => prev.filter((quiz) => quiz._id !== id));
      } else {
        console.error("Quiz deletion failed:", data.msg || "Unknown error");
      }
    } catch (err) {
      console.error("Error deleting quiz:", err);
    }
  };

  return (
    <QuizContext.Provider
      value={{
        quizzes,
        myQuizzes,
        fetchAllQuizzes,
        fetchMyQuizzes,
        createQuiz,
        updateQuiz,
        deleteQuiz,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export default QuizState;
