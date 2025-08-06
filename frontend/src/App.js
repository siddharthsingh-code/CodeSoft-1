import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import ResultPage from "./components/ResultPage";
import QuizPage from "./components/QuestionDisplay";
import QuizList from "./components/Quiz";
import TestHistory from "./components/candidate/TestHistory";
import ProfilePage from "./components/candidate/Profile";
import Signup from "./components/candidate/SignUp";
import Login from "./components/candidate/Login";
import MyQuizzes from "./components/Quizmanger/MyQuizzes";
import ViewQuestions from "./components/Quizmanger/ViewQuestion";
import ViewParticipants from "./components/Quizmanger/Participant";
import UpdateQuiz from "./components/Quizmanger/UpdateQuiz";
import CreateQuiz from "./components/QuizCreation/CreateQuiz";
import AddQuestions from "./components/QuizCreation/AddQuuestion";
import UpdateProfile from "./components/candidate/UpdateProfile";
import About from "./components/About";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz/:id/question" element={<QuizPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/quizs" element={<QuizList />} />
        <Route path="/view/:id" element={<ViewQuestions />} />
        <Route path="/view-participants/:id" element={<ViewParticipants />} />
        <Route path="/myquizzes" element={<MyQuizzes />} />
        <Route path="/QuizsHistory" element={<TestHistory />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/about" element={< About/>} />
        <Route path="/update/:id" element={<UpdateQuiz />} />
        <Route path="/createquiz" element={<CreateQuiz />} />
        <Route path="/addQuestion/:id" element={<AddQuestions />} />
        <Route path="/updateprofile" element={<UpdateProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
