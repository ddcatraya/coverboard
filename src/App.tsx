import { useCoverContext } from 'contexts';
import { CoverBoard } from 'CoverBoard';
import { backColorMap } from 'types';

function App() {
  const { configs } = useCoverContext();

  return (
    <div
      className="App"
      style={{ backgroundColor: backColorMap[configs.backColor] }}>
      <CoverBoard />
    </div>
  );
}
export default App;
