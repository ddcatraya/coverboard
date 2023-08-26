import React from 'react';
import { Circle, Group } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';

import { Lines } from 'types';
import { useMainStore, useUtilsStore } from 'store';

interface LineProps {
  id: Lines['id'];
  handleOpen: (line: Lines['id']) => void;
}

export const DrawLineCircle: React.FC<LineProps> = ({ handleOpen, id }) => {
  const circleRadius = useMainStore((state) => state.circleRadius());
  const color = useMainStore((state) => state.getColor());
  const erase = useUtilsStore((state) => state.erase);

  return (
    <Group
      width={circleRadius * 2}
      height={circleRadius * 2}
      onClick={() => handleOpen(id)}
      onTap={() => handleOpen(id)}>
      <Circle
        radius={circleRadius}
        fill={color}
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