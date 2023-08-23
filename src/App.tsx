import { Snackbar, Alert } from '@mui/material';
import { CoverBoard } from 'CoverBoard';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useMainStore, useToastStore } from 'store';
import { DEFAULT_KEY } from 'types';

const throttle = (func: () => void, delay: number) => {
  let inProgress = false;
  return () => {
    if (inProgress) {
      return;
    }
    inProgress = true;
    setTimeout(() => {
      func();
      inProgress = false;
    }, delay);
  };
};

function App() {
  const { saveId = DEFAULT_KEY } = useParams();
  const setDefaultLocalStoreValues = useMainStore(
    (state) => state.setDefaultLocalStoreValues,
  );
  const backColor = useMainStore((state) => state.getBackColor());
  const setWindowSize = useMainStore((state) => state.setWindowSize);

  const toastMessage = useToastStore((state) => state.toastMessage);
  const handleToastMessageClose = useToastStore(
    (state) => state.handleToastMessageClose,
  );

  useEffect(() => {
    setDefaultLocalStoreValues(saveId);
  }, [saveId, setDefaultLocalStoreValues]);

  useEffect(() => {
    const throttleResize = throttle(() => {
      setWindowSize();
    }, 500);

    window.addEventListener('resize', throttleResize);
    return () => {
      window.removeEventListener('resize', throttleResize);
    };
  }, [setWindowSize]);

  return (
    <div className="App" style={{ backgroundColor: backColor }}>
      <CoverBoard />
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
    </div>
  );
}
export default App;
