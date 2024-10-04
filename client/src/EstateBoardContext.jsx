import React, { createContext, useState, useContext } from "react";

const EstateBoardContext = createContext();

const EstateBoardProvider = ({ children }) => {
  const [year, setYear] = useState(2023);
  const [netWorth, setNetWorth] = useState(0);
  const [liabilities, setLiabilities] = useState(0);

  const contextValue = {
    year,
    setYear,
    netWorth,
    setNetWorth,
    liabilities,
    setLiabilities,
  };

  return (
    <EstateBoardContext.Provider value={contextValue}>
      {children}
    </EstateBoardContext.Provider>
  );
};

const useEstateBoard = () => {
  const context = useContext(EstateBoardContext);
  if (!context) {
    throw new Error("useEstateBoard must be used within an EstateBoardProvider");
  }
  return context;
};

export { EstateBoardProvider, useEstateBoard };