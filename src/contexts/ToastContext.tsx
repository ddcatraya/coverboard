import { Snackbar, Alert } from '@mui/material';
import React, { createContext, useState, useContext } from 'react';

interface ToastContextData {
  showSuccessMessage: (text: string) => void;
  showErrorMessage: (text: string) => void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export const useToastContext = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'error';
  } | null>(null);

  const showSuccessMessage = (text: string) => {
    setToastMessage({ text, type: 'success' });
  };

  const showErrorMessage = (text: string) => {
    setToastMessage({ text, type: 'error' });
  };

  const handleToastMessageClose = () => {
    setToastMessage(null);
  };

  return (
    <ToastContext.Provider value={{ showSuccessMessage, showErrorMessage }}>
      {children}
      <Snackbar
        open={!!toastMessage}
        autoHideDuration={3000}
        onClose={handleToastMessageClose}>
        <Alert severity="success" onClose={handleToastMessageClose}>
          {toastMessage?.text}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
