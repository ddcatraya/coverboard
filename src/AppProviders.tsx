import App from 'App';
import {
  ToastProvider,
  ApiProvider,
  CoverProvider,
  SizesProvider,
} from 'contexts';

export const AppProviders = () => {
  return (
    <ToastProvider>
      <ApiProvider>
        <CoverProvider>
          <SizesProvider>
            <App />
          </SizesProvider>
        </CoverProvider>
      </ApiProvider>
    </ToastProvider>
  );
};
