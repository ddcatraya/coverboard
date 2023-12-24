import { Group, Rect, Star } from 'react-konva';
import { useMainStore, useUtilsStore } from 'store';
import { Covers } from 'types';

interface CoverStarProps {
  id: Covers['id'];
  offset?: number;
}

export const CoverStar: React.FC<CoverStarProps> = ({ id, offset = 0 }) => {
  const starRadius = useMainStore((state) => state.starRadius());
  const starCount = useMainStore((state) => state.getStarCount(id));
  const coverSizeWidth = useMainStore((state) =>
    state.coverSizeWidthScaled(id),
  );
  const coverSizeHeight = useMainStore((state) =>
    state.coverSizeHeightScaled(id),
  );
  const fontSize = useMainStore((state) => state.fontSize());
  const color = useMainStore((state) => state.getColor());
  const backColor = useMainStore((state) => state.getBackColor());
  const updateStarCount = useMainStore((state) => state.updateStarCount);
  const erase = useUtilsStore((state) => state.erase);
  const editLines = useUtilsStore((state) => state.editLines);

  const handleClick = (evt, index) => {
    evt.cancelBubble = true;

    if (index < 0 || index > 5) return;

    if (index === starCount) {
      updateStarCount(id, index - 1);
    } else if (index - 0.5 === starCount) {
      updateStarCount(id, index);
    } else {
      updateStarCount(id, index - 0.5);
    }
  };

  const totalWidth = 4 * starRadius * 3;

  if (erase || editLines) return null;

  return (
    <Group opacity={starCount ? 1 : 0.3}>
      {[...Array(5)].map((_, index) => (
        <Group
          key={index}
          x={coverSizeWidth / 2 + index * starRadius * 3}
          y={coverSizeHeight + fontSize / 2 + offset}
          onClick={(evt) => handleClick(evt, index + 1)}
          onTap={(evt) => handleClick(evt, index + 1)}>
          <Star
            numPoints={5}
            innerRadius={starRadius / 1.7}
            outerRadius={starRadius}
            fill={index < starCount ? color : 'transparent'}
            stroke={color}
            strokeWidth={2}
          />
          {index === Math.floor(starCount) && !Number.isInteger(starCount) && (
            <>
              <Rect
                y={-starRadius}
                width={starRadius * 0.9}
                height={starRadius * 2}
                fill={backColor}
              />
              <Star
                numPoints={5}
                innerRadius={starRadius / 1.7}
                outerRadius={starRadius}
                stroke={color}
                strokeWidth={2}
              />
            </>
          )}
        </Group>
      ))}
    </Group>
  );
};
