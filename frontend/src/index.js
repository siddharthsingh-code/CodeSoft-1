import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import QuizState from './Context/Quizcontext/QuizState';
import QuestionState from './Context/Questioncontext/QuestionState';
import ResultState from './Context/Resultcontext/ResultState';
import AuthState from './Context/Auth/AuthState';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthState>
    <QuizState>
        <QuestionState>
          <ResultState>
            <App />
          </ResultState>
        </QuestionState>
    </QuizState>
    </AuthState>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
