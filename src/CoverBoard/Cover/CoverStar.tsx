import { useState } from 'react';
import { Group, Rect, Star } from 'react-konva';
import { useMainStore } from 'store';
import { Covers } from 'types';

interface CoverStarProps {
  id: Covers['id'];
  offset?: number;
}

export const CoverStar: React.FC<CoverStarProps> = ({ id, offset = 0 }) => {
  const starRadius = useMainStore((state) => state.starRadius());
  const starCount = useMainStore((state) => state.getStarCount(id));
  const coverSizeWidth = useMainStore((state) => state.coverSizeWidth());
  const coverSizeHeight = useMainStore((state) => state.coverSizeHeight());
  const fontSize = useMainStore((state) => state.fontSize());
  const color = useMainStore((state) => state.getColor());
  const backColor = useMainStore((state) => state.getBackColor());
  const updateStarCount = useMainStore((state) => state.updateStarCount);

  const [filledIndex, setFilledIndex] = useState(0);

  const handleClick = (evt) => {
    evt.cancelBubble = true;

    if (filledIndex < 0 || filledIndex > 5) return;

    updateStarCount(id, filledIndex);
  };

  const handleMouseEnter = (evt, index) => {
    evt.cancelBubble = true;

    if (index === starCount) {
      setFilledIndex(index - 1);
    } else if (index - 0.5 === starCount) {
      setFilledIndex(index);
    } else {
      setFilledIndex(index - 0.5);
    }
  };

  const totalWidth = 4 * starRadius * 3;

  return (
    <>
      {[...Array(5)].map((_, index) => (
        <Group
          key={index}
          x={coverSizeWidth / 2 + index * starRadius * 3 - totalWidth / 2}
          y={coverSizeHeight + fontSize / 2 + offset}
          onClick={handleClick}
          onMouseEnter={(evt) => handleMouseEnter(evt, index + 1)}
          onMouseLeave={() => setFilledIndex(0)}>
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
    </>
  );
};
