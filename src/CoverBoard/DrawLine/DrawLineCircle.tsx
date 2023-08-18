import React from 'react';
import { Circle } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';

import { useCoverContext, useSizesContext } from 'contexts';
import { colorMap, LinePoint } from 'types';

interface LineProps {
  line: LinePoint;
  handleOpen: (line: LinePoint) => void;
}

export const DrawLineCircle: React.FC<LineProps> = (props) => {
  const { line, handleOpen } = props;
  const { circleRadius } = useSizesContext();
  const { erase, configs } = useCoverContext();

  return (
    <Circle
      radius={circleRadius}
      fill={colorMap[configs.color]}
      onClick={() => handleOpen(line)}
      onDblTap={() => handleOpen(line)}
      onMouseMove={(evt: KonvaEventObject<MouseEvent>) => {
        const container = evt.target.getStage()?.container();

        if (container && !erase) {
          container.style.cursor = 'pointer';
        } else if (container && erase) {
          container.style.cursor = 'not-allowed';
        }
      }}
      onMouseLeave={(evt: KonvaEventObject<MouseEvent>) => {
        const container = evt.target.getStage()?.container();

        if (container) {
          container.style.cursor = 'default';
        }
      }}
    />
  );
};
