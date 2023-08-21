import App from 'App';
import { ToastProvider, ApiProvider, SizesProvider } from 'contexts';

export const AppProviders = () => {
  return (
    <ToastProvider>
      <ApiProvider>
        <SizesProvider>
          <App />
        </SizesProvider>
      </ApiProvider>
    </ToastProvider>
  );
};
