import App from 'App';
import { ToastProvider, ApiProvider } from 'contexts';

export const AppProviders = () => {
  return (
    <ToastProvider>
      <ApiProvider>
        <App />
      </ApiProvider>
    </ToastProvider>
  );
};
