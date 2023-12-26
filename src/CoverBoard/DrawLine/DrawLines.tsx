import { Group } from 'react-konva';
import { useMainStore, useUtilsStore } from 'store';
import { DrawLine } from './DrawLine';

export const DrawLines: React.FC = () => {
  const lines = useMainStore((state) => state.lines);
  const setSelected = useUtilsStore((state) => state.setSelected);

  const handlesSelect = (evt, coverId: string) => {
    evt.cancelBubble = true;
    setSelected({ id: coverId, elem: 'arrow' });
  };

  return (
    <>
      {lines.map((line) => (
        <Group
          key={line.id}
          onClick={(evt) => handlesSelect(evt, line.id)}
          onTouchStart={(evt) => handlesSelect(evt, line.id)}>
          <DrawLine
            id={line.id}
            dir={line.dir}
            originId={line.origin.id}
            originDir={line.origin.dir}
            targetId={line.target.id}
            targetDir={line.target.dir}
            key={line.id}
          />
        </Group>
      ))}
    </>
  );
};
