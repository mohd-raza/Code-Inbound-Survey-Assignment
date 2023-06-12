import React, { useState, useEffect } from "react";

const SurveyForm = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);

  const questions = [
    "How satisfied are you with our products?",
    "How fair are the prices compared to similar retailers?",
    "How satisfied are you with the value for money of your purchase?",
    "On a scale of 1-10, how likely are you to recommend us to your friends and family?",
    "What could we do to improve our service?",
  ];

  useEffect(() => {
    const sessionAnswers = localStorage.getItem("surveyAnswers");
    if (sessionAnswers) {
      setAnswers(JSON.parse(sessionAnswers));
    }
  }, []);

  const generateSessionId = () => {
    const timestamp = Date.now().toString(36);
    const randomId = Math.random().toString(36).substr(2, 5);
    return `${timestamp}-${randomId}`;
  };

  const startSurvey = () => {
    const sessionId = generateSessionId();
    localStorage.setItem("sessionId", sessionId);
    setShowWelcomeScreen(false);
  };

  const handleAnswer = (answer) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = answer;
    setAnswers(updatedAnswers);
    localStorage.setItem("surveyAnswers", JSON.stringify(updatedAnswers));

    if (currentQuestionIndex !== questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const showConfirmationDialog = () => {
    const confirmed = window.confirm(
      "Are you sure you want to submit the survey?"
    );
    if (confirmed) {
      setIsCompleted(true);
      localStorage.setItem("surveyStatus", "COMPLETED");
    }
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
  };

  const handleSkipQuestion = () => {
    handleAnswer(null);
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setIsCompleted(false);
    setShowWelcomeScreen(true);
    localStorage.removeItem("sessionId");
    localStorage.removeItem("surveyAnswers");
    localStorage.removeItem("surveyStatus");
  };

  if (showWelcomeScreen) {
    return (
      <div>
        <h1>Welcome to our shop!</h1>
        <button onClick={startSurvey}>Start</button>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div>
        <h2>Thank you for your time!</h2>
        <p>We appreciate your feedback.</p>
        <button onClick={handleRestart}>Start Again</button>
      </div>
    );
  }

  return (
    <div>
      <h2>
        Question {currentQuestionIndex + 1}/{questions.length}
      </h2>
      <p>{questions[currentQuestionIndex]}</p>
      <div>
        {currentQuestionIndex === 3 ? (
          // Question 4
          Array.from({ length: 10 }, (_, index) => (
            <button key={index + 1} onClick={() => handleAnswer(index + 1)}>
              {index + 1}
            </button>
          ))
        ) : currentQuestionIndex === 4 ? (
          // Question 5
          <>
            <input type="text" onChange={(e) => handleAnswer(e.target.value)} />
            <button onClick={showConfirmationDialog}>Complete</button>
          </>
        ) : (
          // Other questions
          <>
            <button onClick={() => handleAnswer(1)}>1</button>
            <button onClick={() => handleAnswer(2)}>2</button>
            <button onClick={() => handleAnswer(3)}>3</button>
            <button onClick={() => handleAnswer(4)}>4</button>
            <button onClick={() => handleAnswer(5)}>5</button>
          </>
        )}
      </div>
      <button
        onClick={handlePreviousQuestion}
        disabled={currentQuestionIndex === 0}
      >
        Previous
      </button>
      <button onClick={handleSkipQuestion}>Skip</button>
    </div>
  );
};

export default SurveyForm;
