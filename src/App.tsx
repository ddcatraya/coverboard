import { CoverBoard } from 'CoverBoard';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useMainStore } from 'store';
import { backColorMap, DEFAULT_KEY } from 'types';

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
  const configs = useMainStore((state) => state.configs);
  const setWindowSize = useMainStore((state) => state.setWindowSize);

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
    <div
      className="App"
      style={{ backgroundColor: backColorMap[configs.backColor] }}>
      <CoverBoard />
    </div>
  );
}
export default App;
