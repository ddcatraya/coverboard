import { Group } from 'react-konva';
import { useMainStore, useUtilsStore } from 'store';
import { Cover } from './Cover';

export const Covers: React.FC = () => {
  const covers = useMainStore((state) => state.covers);
  const setSelected = useUtilsStore((state) => state.setSelected);
  const refreshCovers = useMainStore((state) => state.refreshCovers);

  const handleSelect = (evt, coverId: string) => {
    evt.cancelBubble = true;
    setSelected({ id: coverId, elem: 'cover', open: false });
    refreshCovers(coverId);
  };

  return (
    <>
      {covers.map((cover, index) => (
        <Group
          key={cover.id}
          onClick={(evt) => handleSelect(evt, cover.id)}
          onTouchStart={(evt) => handleSelect(evt, cover.id)}>
          <Cover
            id={cover.id}
            title={cover.title.text}
            subtitle={cover.subtitle.text}
            x={cover.x}
            y={cover.y}
            titleDir={cover.title.dir}
            subTitleDir={cover.subtitle.dir}
            starDir={cover.star.dir}
            link={cover.link}
            key={cover.id}
            renderTime={400 * index}
          />
        </Group>
      ))}
    </>
  );
};
