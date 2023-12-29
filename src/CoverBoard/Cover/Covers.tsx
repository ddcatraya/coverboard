import { Group } from 'react-konva';
import { useMainStore } from 'store';
import { Cover } from './Cover';

export const Covers: React.FC = () => {
  const covers = useMainStore((state) => state.covers);

  return (
    <>
      {covers.map((cover, index) => (
        <Cover
          key={cover.id}
          id={cover.id}
          title={cover.title.text}
          subtitle={cover.subtitle.text}
          x={cover.x}
          y={cover.y}
          titleDir={cover.title.dir}
          subTitleDir={cover.subtitle.dir}
          starDir={cover.star.dir}
          link={cover.link}
          renderTime={400 * index}
        />
      ))}
    </>
  );
};
