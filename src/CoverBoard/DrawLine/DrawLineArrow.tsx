import React from 'react';
import { Arrow } from 'react-konva';

import { useCoverContext, useSizesContext } from 'contexts';
import { colorMap, LineParams } from 'types';

interface LineProps {
  lineParams: LineParams;
}

export const DrawLineArrow: React.FC<LineProps> = ({ lineParams }) => {
  const { fontSize } = useSizesContext();
  const { configs } = useCoverContext();

  if (!lineParams) return null;

  return (
    <Arrow
      points={lineParams.points}
      stroke={colorMap[configs.color]}
      strokeWidth={fontSize / 4}
      pointerLength={fontSize}
      listening={false}
    />
  );
};
