import React, { createContext } from "react";
export const AppContent = createContext();

const AppContextProvider = (props) => {
  const value = {};
  return (
    <AppContent.Provider value={value}>{props.children}</AppContent.Provider>
  );
};

export default AppContext;
