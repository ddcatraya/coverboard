import { useState } from 'react';
import { Star } from 'react-konva';
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
  const updateStarCount = useMainStore((state) => state.updateStarCount);

  const [filledIndex, setFilledIndex] = useState(0);

  const handleClick = (evt) => {
    evt.cancelBubble = true;

    if (filledIndex < 0 || filledIndex > 5) return;

    if (filledIndex === starCount) {
      updateStarCount(id, Math.max(filledIndex - 1, 0));
      return;
    }
    updateStarCount(id, filledIndex);
  };

  const handleMouseEnter = (evt, index) => {
    evt.cancelBubble = true;
    setFilledIndex(index + 1);
  };

  const totalWidth = 4 * starRadius * 3;

  return (
    <>
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          x={coverSizeWidth / 2 + index * starRadius * 3 - totalWidth / 2}
          y={coverSizeHeight + fontSize / 2 + offset}
          numPoints={5}
          innerRadius={starRadius / 1.7}
          outerRadius={starRadius}
          fill={index < starCount ? color : 'transparent'}
          stroke={color}
          strokeWidth={2}
          onClick={handleClick}
          onMouseEnter={(evt) => handleMouseEnter(evt, index)}
          onMouseLeave={() => setFilledIndex(0)}
        />
      ))}
    </>
  );
};
