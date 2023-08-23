import React from 'react';
import { Arrow } from 'react-konva';

import { colorMap, LineParams } from 'types';
import { useMainStore } from 'store';

interface LineProps {
  lineParams: LineParams;
}

export const DrawLineArrow: React.FC<LineProps> = ({ lineParams }) => {
  const fontSize = useMainStore((state) => state.fontSize());
  const color = useMainStore((state) => state.configs.color);

  if (!lineParams) return null;

  return (
    <Arrow
      points={lineParams.points}
      stroke={colorMap[color]}
      strokeWidth={fontSize / 4}
      pointerLength={fontSize}
      listening={false}
    />
  );
};
