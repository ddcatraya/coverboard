import React from 'react';
import { Circle, Group } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';

import { useMainStore } from 'store';

interface LineProps {
  isSelected: boolean;
}

export const DrawLineCircle: React.FC<LineProps> = ({ isSelected }) => {
  const circleRadius = useMainStore((state) => state.circleRadius());
  const color = useMainStore((state) => state.getArrowColor());

  return (
    <Group width={circleRadius * 2} height={circleRadius * 2}>
      <Circle
        radius={isSelected ? circleRadius * 1.3 : circleRadius}
        fill={color}
        onMouseMove={(evt: KonvaEventObject<MouseEvent>) => {
          if (!isSelected) {
            evt.currentTarget.scaleX(1.3);
            evt.currentTarget.scaleY(1.3);
          }

          const container = evt.target.getStage()?.container();
          if (container) {
            container.style.cursor = 'pointer';
          }
        }}
        onMouseLeave={(evt: KonvaEventObject<MouseEvent>) => {
          if (!isSelected) {
            evt.currentTarget.scaleX(1);
            evt.currentTarget.scaleY(1);
          }

          const container = evt.target.getStage()?.container();

          if (container) {
            container.style.cursor = 'default';
          }
        }}
      />
    </Group>
  );
};
