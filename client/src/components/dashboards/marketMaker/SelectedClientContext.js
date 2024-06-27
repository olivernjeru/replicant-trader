import React, { createContext, useContext, useState } from 'react';

const SelectedClientContext = createContext();

export const useSelectedClient = () => {
  return useContext(SelectedClientContext);
};

export const SelectedClientProvider = ({ children }) => {
  const [selectedClientId, setSelectedClientId] = useState(null);

  return (
    <SelectedClientContext.Provider value={{ selectedClientId, setSelectedClientId }}>
      {children}
    </SelectedClientContext.Provider>
  );
};
