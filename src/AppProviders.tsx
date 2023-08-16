import App from 'App';
import {
  ToastProvider,
  ApiProvider,
  CoverProvider,
  SizesProvider,
} from 'contexts';
import { DEFAULT_KEY } from 'contexts/CoverContext/CoverContext';
import { initialConfigValues } from 'contexts/CoverContext/useConfigs';
import { useParams } from 'react-router-dom';
import { LocalStorageKeys } from 'types';

export const AppProviders = () => {
  const { saveId = DEFAULT_KEY } = useParams();

  window.localStorage.setItem(
    saveId,
    JSON.stringify({
      [LocalStorageKeys.CONFIG]: { ...initialConfigValues },
      [LocalStorageKeys.COVER]: [],
      [LocalStorageKeys.LINES]: [],
    }),
  );

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
