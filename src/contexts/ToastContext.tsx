import { Snackbar, Alert } from '@mui/material';
import React, { createContext, useState, useContext, useCallback } from 'react';

interface ToastContextData {
  showSuccessMessage: (text: string) => void;
  showErrorMessage: (text: string) => void;
  showWarningMessage: (text: string) => void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export const useToastContext = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'error' | 'warning';
  } | null>(null);

  const showSuccessMessage = useCallback((text: string) => {
    setToastMessage({ text, type: 'success' });
  }, []);

  const showErrorMessage = useCallback((text: string) => {
    setToastMessage({ text, type: 'error' });
  }, []);

  const showWarningMessage = useCallback((text: string) => {
    setToastMessage({ text, type: 'warning' });
  }, []);

  const handleToastMessageClose = () => {
    setToastMessage(null);
  };

  return (
    <ToastContext.Provider
      value={{ showSuccessMessage, showErrorMessage, showWarningMessage }}>
      {children}
      {toastMessage && (
        <Snackbar
          open={!!toastMessage}
          autoHideDuration={3000}
          onClose={handleToastMessageClose}>
          <Alert
            severity={toastMessage?.type}
            onClose={handleToastMessageClose}>
            {toastMessage?.text}
          </Alert>
        </Snackbar>
      )}
    </ToastContext.Provider>
  );
};
