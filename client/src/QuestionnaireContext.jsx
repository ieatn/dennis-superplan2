import React, { createContext, useContext, useState } from 'react';

const QuestionnaireContext = createContext();

export const useQuestionnaire = () => useContext(QuestionnaireContext);

export const QuestionnaireProvider = ({ children }) => {
  const [questionnaireData, setQuestionnaireData] = useState({
    question1: [],
    question2: [],
    question3: [],
    question4: [],
    question5: [],
    question6: [],
  });

  return (
    <QuestionnaireContext.Provider value={{ questionnaireData, setQuestionnaireData }}>
      {children}
    </QuestionnaireContext.Provider>
  );
};