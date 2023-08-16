import React, { createContext, useContext, useState } from 'react';

import { apiConfig } from 'api';
import { ApiKey } from 'types';

interface ApiContextData {
  apiKey: ApiKey;
  setApikeys: React.Dispatch<React.SetStateAction<ApiKey>>;
}

const ApiContext = createContext<ApiContextData>({} as ApiContextData);

export const useApiContext = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApiContext must be used within a ApiProvider');
  }
  return context;
};

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [apiKey, setApikeys] = useState({
    LastFMKey: apiConfig.LastFMKey,
  });

  return (
    <ApiContext.Provider
      value={{
        apiKey,
        setApikeys,
      }}>
      {children}
    </ApiContext.Provider>
  );
};
