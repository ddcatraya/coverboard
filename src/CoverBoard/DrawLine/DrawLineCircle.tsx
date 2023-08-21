import React from 'react';
import { Circle, Group } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';

import { useCoverContext, useSizesContext } from 'contexts';
import { backColorMap, colorMap, Lines } from 'types';

interface LineProps {
  line: Lines;
  handleOpen: (line: Lines) => void;
}

export const DrawLineCircle: React.FC<LineProps> = (props) => {
  const { line, handleOpen } = props;
  const { circleRadius } = useSizesContext();
  const { erase, configs } = useCoverContext();

  return (
    <Group
      width={circleRadius * 2}
      height={circleRadius * 2}
      onClick={() => handleOpen(line)}
      onTap={() => handleOpen(line)}>
      <Circle
        radius={circleRadius * 2}
        fill={backColorMap[configs.backColor]}
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
      <Circle
        radius={circleRadius}
        fill={colorMap[configs.color]}
        onMouseMove={(evt: KonvaEventObject<MouseEvent>) => {
          evt.currentTarget.scaleX(1.3);
          evt.currentTarget.scaleY(1.3);

          const container = evt.target.getStage()?.container();
          if (container && !erase) {
            container.style.cursor = 'pointer';
          } else if (container && erase) {
            container.style.cursor = 'not-allowed';
          }
        }}
        onMouseLeave={(evt: KonvaEventObject<MouseEvent>) => {
          evt.currentTarget.scaleX(1);
          evt.currentTarget.scaleY(1);

          const container = evt.target.getStage()?.container();

          if (container) {
            container.style.cursor = 'default';
          }
        }}
      />
    </Group>
  );
};
