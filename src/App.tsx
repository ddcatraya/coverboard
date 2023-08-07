import { useCoverContext } from 'contexts';
import { CoverBoard } from 'CoverBoard';

function App() {
  const { configs } = useCoverContext();

  return (
    <div className="App" style={{ backgroundColor: configs.backColor }}>
      <CoverBoard />
    </div>
  );
}
export default App;
