import App from 'App';
import { ToastProvider } from 'contexts';

export const AppProviders = () => {
  return (
    <ToastProvider>
      <App />
    </ToastProvider>
  );
};
