import {  useState } from "react";
import QuestionContext from "./QuestionContext";
const host = process.env.REACT_APP_HOST ;

const QuestionState = ({ children }) => {
  const [questions, setQuestions] = useState([]);
  const Token = localStorage.getItem("token");

  // Fetch questions for a quiz (with optional password)
  const getQuestions = async (quiz_id, password = "") => {
    try {
      const res = await fetch(`${host}/api/question/quiz/${quiz_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": Token,
        },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      setQuestions(data);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    }
  };

  // Add a new question
 const addQuestion = async (
   quiz_id,
   questionText,
   description,
   options,
   answer
 ) => {
   try {
     const res = await fetch(`${host}/api/question/create`, {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
         "auth-token": Token,
       },
       body: JSON.stringify({
         quiz_id,
         question: questionText, 
         description,
         options,
         answer, 
       }),
     });

     const data = await res.json();

     if (res.ok) {
     } else {
       console.error("Add question failed:", data.error);
     }
   } catch (err) {
     console.error("Error adding question:", err);
   }
 };
 


  const updateQuestion = async (id, updatedData) => {
    try {
      const res = await fetch(`${host}/api/question/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": Token,
        },
        body: JSON.stringify(updatedData),
      });
      const updated = await res.json();

      setQuestions((prev) => prev.map((q) => (q._id === id ? updated : q)));
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };


  

  const deleteQuestion = async (id) => {
    try {
      await fetch(`${host}/api/question/${id}`, {
        method: "DELETE",
        headers: {
          "auth-token": Token,
        },
      });
      setQuestions((prev) => prev.filter((q) => q._id !== id));
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };


  
  const deleteAllQuestions = async (quiz_id) => {
    try {
      await fetch(`${host}/api/question/quiz/${quiz_id}`, {
        method: "DELETE",
        headers: {
          "auth-token": Token,
        },
      });
      setQuestions([]);
    } catch (error) {
      console.error("Error deleting all questions:", error);
    }
  };


  return (
    <QuestionContext.Provider
      value={{
        questions,
        getQuestions,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        deleteAllQuestions,
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
};

export default QuestionState;
