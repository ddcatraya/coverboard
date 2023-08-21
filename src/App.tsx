import { CoverBoard } from 'CoverBoard';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useMainStore } from 'store';
import { backColorMap, DEFAULT_KEY } from 'types';

function App() {
  const { saveId = DEFAULT_KEY } = useParams();
  const setDefaultValues = useMainStore((state) => state.setDefaultValues);
  const updateValues = useMainStore((state) => state.updateValues);
  const configs = useMainStore((state) => state.configs);
  const covers = useMainStore((state) => state.covers);
  const lines = useMainStore((state) => state.lines);

  useEffect(() => {
    setDefaultValues(saveId);
  }, [saveId, setDefaultValues]);

  useEffect(() => {
    updateValues(saveId);
  }, [configs, covers, lines, saveId, updateValues]);

  return (
    <div
      className="App"
      style={{ backgroundColor: backColorMap[configs.backColor] }}>
      <CoverBoard />
    </div>
  );
}
export default App;
