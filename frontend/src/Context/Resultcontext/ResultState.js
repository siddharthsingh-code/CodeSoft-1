import React, {  useState } from "react";
import ResultContext from "./ResultContext";
const host = process.env.REACT_APP_HOST;

export const ResultState = ({ children }) => {
  const [results, setResults] = useState([]);
  const [myStats, setMyStats] = useState({});
  const [quizResults, setQuizResults] = useState([]);
  const [myResult, setMyResult]=useState([]);
  const token = localStorage.getItem("token");

  // ✅ Create Result
  const createResult = async (
    quiz_id,
    name,
    title,
    profession,
    institution,
    score,
    total,
    percentage,
    starsEarned
  ) => {
    const response = await fetch(`${host}/api/result/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      },
      body: JSON.stringify(
       { quiz_id,
        name,
        title,
        profession,
        institution,
        score,
        total,
        percentage,
        starsEarned}
      ),
    });

    const result = await response.json();
    if (response.ok) {
      return result;
    } else {
      console.error("Failed to create result:", result);
      return null;
    }
  };

  // ✅ Get My Results
  const getMyResults = async () => {
    const response = await fetch(`${host}/api/result/my`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      },
    });

    const data = await response.json();
    if (response.ok) {
      setResults(data);
    } else {
      console.error("Error fetching my results");
    }
  };

  // ✅ Get Stats
  const getStats = async () => {
    const response = await fetch(`${host}/api/result/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      },
    });

    const data = await response.json();
    if (response.ok) {
      setMyStats(data);
    } else {
      console.error("Error fetching stats");
    }
  };

  // ✅ Get Results by Quiz ID
  const getResultsByQuizId = async (quiz_id) => {
    const response = await fetch(`${host}/api/result/quiz/${quiz_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      },
    });

    const data = await response.json();
    if (response.ok) {
      setQuizResults(data);
    } else {
      console.error("Error fetching quiz results");
    }
  };
  
const fetchMyQuizResult = async (quizId, token) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/result/myresult/${quizId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      }
    );
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.error || "Failed to fetch result");
    }
    setMyResult(data);

    
  } catch (err) {
    console.error("Error fetching quiz result:", err.message);
    throw err;
  }
};


  return (
    <ResultContext.Provider
      value={{
        results,
        createResult,
        getMyResults,
        myStats,
        getStats,
        quizResults,
        getResultsByQuizId,
        myResult,
        fetchMyQuizResult,
      }}
    >
      {children}
    </ResultContext.Provider>
  );
};


export default ResultState;
