import { CoverBoard } from 'CoverBoard';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useMainStore } from 'store';
import { backColorMap, DEFAULT_KEY } from 'types';

function App() {
  const { saveId = DEFAULT_KEY } = useParams();
  const setDefaultLocalStoreValues = useMainStore(
    (state) => state.setDefaultLocalStoreValues,
  );
  const configs = useMainStore((state) => state.configs);

  useEffect(() => {
    setDefaultLocalStoreValues(saveId);
  }, [saveId, setDefaultLocalStoreValues]);

  return (
    <div
      className="App"
      style={{ backgroundColor: backColorMap[configs.backColor] }}>
      <CoverBoard />
    </div>
  );
}
export default App;
